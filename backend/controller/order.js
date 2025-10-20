const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
const PendingRide = require("../model/ride.model");
const rideService = require("../utils/ride.service");
const mapService = require("../utils/maps.service");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

      // Group cart items by shopId
      const shopIds = [...new Set(cart.map((item) => item.shopId))];
      let orders = [];
      if (shopIds.length === 1) {
        // Only one shop, create a single order
        const order = await Order.create({
          cart,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
          status: "Pending",
        });
        orders.push(order);
      } else {
        // Multiple shops, create one order per shop
        const shopItemsMap = new Map();
        for (const item of cart) {
          const shopId = item.shopId;
          if (!shopItemsMap.has(shopId)) {
            shopItemsMap.set(shopId, []);
          }
          shopItemsMap.get(shopId).push(item);
        }
        for (const [shopId, items] of shopItemsMap) {
          const order = await Order.create({
            cart: items,
            shippingAddress,
            user,
            totalPrice,
            paymentInfo,
            status: "Pending",
          });
          orders.push(order);
        }
      }
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// NEW: Shop notifies rider (creates ride without confirming order)
router.post(
  "/notify-rider/:orderId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Notify rider request received");
      console.log("Seller ID:", req.seller?._id);
      console.log("Order ID:", req.params.orderId);

      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);

      if (!order) {
        console.log("Order not found");
        return next(new ErrorHandler("Order not found", 404));
      }

      console.log("Order status:", order.status);
      console.log("Order shopId:", order.cart[0]?.shopId);

      // Verify this order belongs to this shop
      const orderShopId = order.cart[0]?.shopId;
      if (orderShopId !== req.seller._id.toString()) {
        console.log("Order does not belong to this shop");
        return next(
          new ErrorHandler(
            "You can only notify riders for your own orders",
            403
          )
        );
      }

      // Only allow for Pending orders
      if (order.status !== "Pending") {
        console.log("Order not in Pending state");
        return next(
          new ErrorHandler("Can only notify riders for pending orders", 400)
        );
      }

      // Check if ride already exists
      if (order.ride) {
        console.log("Ride already exists for this order");
        return next(
          new ErrorHandler("Ride already created for this order", 400)
        );
      }

      // Create ride for this order (WITHOUT confirming order yet)
      const shopId = order.cart[0].shopId;
      const shop = await Shop.findById(shopId);
      let rideData = null;

      if (shop && order.shippingAddress) {
        const pickupAddress = `${shop.address}, ${shop.city}, ${shop.country}`;
        const destinationAddress = `${order.shippingAddress.address1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`;

        // Create the ride
        const ride = await rideService.createRide({
          user: order.user._id,
          pickup: pickupAddress,
          destination: destinationAddress,
          vehicleType: "moto",
          orderId: order._id,
        });

        order.ride = ride._id;
        order.rideStatus = "pending"; // Track ride status
        await order.save();

        // Get ride with OTP
        const rideWithOTP = await PendingRide.findById(ride._id).select("+otp");

        // Prepare ride data
        rideData = {
          _id: rideWithOTP._id,
          pickup: rideWithOTP.pickup,
          destination: rideWithOTP.destination,
          fare: rideWithOTP.fare,
          status: rideWithOTP.status,
          otp: rideWithOTP.otp,
        };

        // Notify nearby captains
        try {
          console.log("=== NOTIFYING CAPTAINS ===");
          console.log("Getting pickup coordinates for:", pickupAddress);
          const pickupCoordinates = await mapService.getAddressCoordinate(
            pickupAddress
          );
          console.log("Pickup coordinates:", pickupCoordinates);

          console.log("Finding captains in 5km radius...");
          const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat,
            pickupCoordinates.lng,
            5
          );
          console.log(`Found ${captainsInRadius.length} captains in radius`);

          // Log each captain's details
          captainsInRadius.forEach((captain) => {
            console.log(
              `Captain: ${captain._id}, Status: ${captain.status}, SocketId: ${
                captain.socketId
              }, Location: ${JSON.stringify(captain.location)}`
            );
          });

          const io = req.app.get("io");
          if (io && captainsInRadius.length > 0) {
            const rideWithUser = await PendingRide.findOne({
              _id: ride._id,
            }).populate("user");

            console.log("Notifying captains about new ride:", ride._id);
            let notifiedCount = 0;

            captainsInRadius.forEach((captain) => {
              if (captain.socketId) {
                io.to(captain.socketId).emit("new-ride", rideWithUser);
                notifiedCount++;
                console.log(
                  `Emitted new-ride to captain ${captain._id} via socket ${captain.socketId}`
                );
              }
            });

            console.log(`Successfully notified ${notifiedCount} captains`);
          }
        } catch (notificationError) {
          console.error("Error notifying captains:", notificationError);
        }
      }

      res.status(200).json({
        success: true,
        message: "Riders notified successfully! Waiting for captain to accept.",
        order,
        ride: rideData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Shop confirms order AFTER captain accepts
router.post(
  "/confirm-order/:orderId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Confirm order request received");
      console.log("Seller ID:", req.seller?._id);
      console.log("Order ID:", req.params.orderId);

      const orderId = req.params.orderId;
      const order = await Order.findById(orderId).populate({
        path: "ride",
        populate: {
          path: "captain",
          select: "fullname phoneNumber profileImage vehicle",
        },
      });

      if (!order) {
        console.log("Order not found");
        return next(new ErrorHandler("Order not found", 404));
      }

      console.log("Order status:", order.status);
      console.log("Order shopId:", order.cart[0]?.shopId);

      // Verify this order belongs to this shop
      const orderShopId = order.cart[0]?.shopId;
      if (orderShopId !== req.seller._id.toString()) {
        console.log("Order does not belong to this shop");
        return next(
          new ErrorHandler("You can only confirm your own orders", 403)
        );
      }

      // Only allow confirmation of Pending orders that have an accepted ride
      if (order.status !== "Pending") {
        console.log("Order not in Pending state");
        return next(new ErrorHandler("Can only confirm pending orders", 400));
      }

      // Check if ride exists and is accepted
      if (!order.ride) {
        console.log("No ride found for this order");
        return next(new ErrorHandler("Please notify riders first", 400));
      }

      if (order.ride.status !== "accepted") {
        console.log("Ride not accepted yet, status:", order.ride.status);
        return next(
          new ErrorHandler("Wait for a captain to accept the ride first", 400)
        );
      }

      // Update order status to confirmed
      order.status = "Confirmed by Shop";
      order.rideStatus = "accepted";
      await order.save();
      console.log("Order status updated to Confirmed by Shop");

      // Get ride with OTP
      const rideWithOTP = await PendingRide.findById(order.ride._id).select(
        "+otp"
      );

      if (!rideWithOTP) {
        console.log("Ride not found in PendingRide collection");
        return next(new ErrorHandler("Ride not found", 404));
      }

      // Prepare ride data with OTP
      const rideData = {
        _id: rideWithOTP._id,
        pickup: rideWithOTP.pickup,
        destination: rideWithOTP.destination,
        fare: rideWithOTP.fare,
        status: rideWithOTP.status,
        otp: rideWithOTP.otp,
        captain: rideWithOTP.captain,
      };

      res.status(200).json({
        success: true,
        message: "Order confirmed successfully!",
        order,
        ride: rideData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Shop cancels order
router.post(
  "/cancel-order/:orderId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Cancel order request received");
      console.log("Seller ID:", req.seller?._id);
      console.log("Order ID:", req.params.orderId);

      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);

      if (!order) {
        console.log("Order not found");
        return next(new ErrorHandler("Order not found", 404));
      }

      console.log("Order status:", order.status);
      console.log("Order shopId:", order.cart[0]?.shopId);

      // Verify this order belongs to this shop
      const orderShopId = order.cart[0]?.shopId;
      if (orderShopId !== req.seller._id.toString()) {
        console.log("Order does not belong to this shop");
        return next(
          new ErrorHandler("You can only cancel your own orders", 403)
        );
      }

      // Allow cancellation only for Pending or Processing orders
      if (
        order.status !== "Pending" &&
        order.status !== "Processing" &&
        order.status !== "Confirmed by Shop"
      ) {
        console.log("Order cannot be cancelled at this stage");
        return next(
          new ErrorHandler("Order cannot be cancelled at this stage", 400)
        );
      }

      // Update order status to cancelled
      order.status = "Cancelled by Shop";
      await order.save();
      console.log("Order cancelled successfully");

      res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order,
      });
    } catch (error) {
      console.error("Cancel order error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId })
        .populate({
          path: "ride",
          populate: {
            path: "captain",
            select: "fullname phoneNumber profileImage vehicle location", // Include captain location
          },
        })
        .sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("🔍 Fetching orders for shop:", req.params.shopId);

      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      })
        .populate({
          path: "ride",
          select: "+otp", // Include OTP field (it's select: false in model)
          populate: {
            path: "captain",
            select: "fullname phoneNumber profileImage vehicle", // Populate captain details (removed city)
          },
        })
        .sort({
          createdAt: -1,
        });

      console.log("📦 Found", orders.length, "orders");

      // Debug: Log orders with captain data
      if (orders.length > 0) {
        console.log("🔍 Checking all orders for captain data...");
        orders.forEach((order, index) => {
          if (order.ride && order.ride.captain) {
            console.log(`✅ Order ${index + 1} has captain data:`);
            console.log("  - Order ID:", order._id);
            console.log("  - Captain Name:", order.ride.captain.fullname);
            console.log("  - Captain Phone:", order.ride.captain.phoneNumber);
            console.log("  - Captain Vehicle:", order.ride.captain.vehicle);
            console.log("  - Captain Image:", order.ride.captain.profileImage);
          } else if (order.ride) {
            console.warn(`⚠️ Order ${index + 1} has ride but NO captain:`, {
              orderId: order._id,
              rideId: order.ride._id,
              captainField: order.ride.captain,
              captainType: typeof order.ride.captain,
            });
          }
        });
      }

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found with this id", 400));
      }

      // PROTECTION: Cannot update status of cancelled orders
      if (
        order.status === "Cancelled" ||
        order.status === "Cancelled by Shop"
      ) {
        return next(
          new ErrorHandler("Cannot update status of a cancelled order!", 400)
        );
      }

      // PROTECTION: Cannot set status to Cancelled via update (use cancel endpoint)
      if (
        req.body.status === "Cancelled" ||
        req.body.status === "Cancelled by Shop"
      ) {
        return next(
          new ErrorHandler(
            "Use the cancel-order endpoint to cancel orders!",
            400
          )
        );
      }

      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      // Define valid status transitions
      const validStatuses = [
        "Confirmed",
        "Confirmed by Shop",
        "Preparing",
        "Prepared",
        "Transferred to delivery partner",
        "Shipping",
        "Received",
        "On the way",
        "Delivered",
      ];

      console.log(
        `📝 Status update request: "${order.status}" → "${req.body.status}"`
      );

      // Only allow valid status transitions
      if (
        req.body.status === "Confirmed by Shop" &&
        order.status === "Pending"
      ) {
        order.status = "Confirmed by Shop";
        console.log(`✅ Order status updated to "${req.body.status}"`);
      } else if (
        validStatuses.includes(req.body.status) &&
        order.status !== "Cancelled" &&
        order.status !== "Cancelled by Shop"
      ) {
        const oldStatus = order.status;
        order.status = req.body.status;
        console.log(
          `✅ Order status updated from "${oldStatus}" to "${req.body.status}"`
        );
      } else {
        console.log(
          `❌ Invalid status transition from "${order.status}" to "${req.body.status}"`
        );
      }

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";

        // Only update shop balance for PREPAID orders
        // COD orders are handled by ride service when captain completes delivery
        if (order.paymentInfo.type !== "Cash On Delivery") {
          const serviceCharge = order.totalPrice * 0.1;
          await updateSellerInfo(order.totalPrice - serviceCharge);
          console.log(
            `💰 Shop balance updated for PREPAID order: PKR ${
              order.totalPrice - serviceCharge
            }`
          );
        } else {
          console.log(
            `ℹ️ COD order - shop balance will be updated when captain completes delivery`
          );
        }
      }

      await order.save({ validateBeforeSave: false });

      // Emit socket event to notify captain about order status update
      const io = req.app.get("io");
      if (io && order.ride) {
        // Find the ride to get captain's socket ID
        const PendingRide = require("../model/ride.model");
        const ride = await PendingRide.findById(order.ride).populate("captain");

        if (ride && ride.captain && ride.captain.socketId) {
          console.log(
            `📡 Emitting order status update to captain ${ride.captain._id}`
          );
          io.to(ride.captain.socketId).emit("order-status-updated", {
            orderId: order._id,
            status: order.status,
            rideId: ride._id,
          });
        }
      }

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);

        // Add to available balance instead of replacing
        seller.availableBalance += amount;

        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
