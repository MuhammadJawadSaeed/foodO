const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
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

// Shop confirms order, then ride is created
router.post(
  "/confirm-order/:orderId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Confirm order request received");
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
          new ErrorHandler("You can only confirm your own orders", 403)
        );
      }

      // Allow confirmation of Pending or Processing orders (backward compatibility)
      if (order.status !== "Pending" && order.status !== "Processing") {
        console.log("Order already confirmed or processed");
        return next(
          new ErrorHandler("Order already confirmed or processed", 400)
        );
      }

      // Update order status
      order.status = "Confirmed by Shop";
      await order.save();
      console.log("Order status updated to Confirmed by Shop");

      // Create ride for this order
      const shopId = order.cart[0].shopId;
      const shop = await Shop.findById(shopId);
      let rideData = null;

      if (shop && order.shippingAddress) {
        const pickupAddress = `${shop.address}, ${shop.city}, ${shop.country}`;
        const destinationAddress = `${order.shippingAddress.address1}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`;

        // Create the ride (default to motorcycle for food delivery)
        const ride = await rideService.createRide({
          user: order.user._id,
          pickup: pickupAddress,
          destination: destinationAddress,
          vehicleType: "moto",
          orderId: order._id,
        });

        order.ride = ride._id;
        await order.save();

        // Get ride with OTP (OTP field has select: false, so we need to explicitly select it)
        const rideModel = require("../model/ride.model");
        const rideWithOTP = await rideModel.findById(ride._id).select("+otp");

        // Prepare ride data to send back (including OTP for cook)
        rideData = {
          _id: rideWithOTP._id,
          pickup: rideWithOTP.pickup,
          destination: rideWithOTP.destination,
          fare: rideWithOTP.fare,
          status: rideWithOTP.status,
          otp: rideWithOTP.otp, // Send OTP to cook
        };

        // Notify nearby captains about the new ride
        try {
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

          const io = req.app.get("io");
          console.log(
            "Socket.IO instance:",
            io ? "Available" : "Not available"
          );

          if (io && captainsInRadius.length > 0) {
            const rideModel = require("../model/ride.model");
            const rideWithUser = await rideModel
              .findOne({ _id: ride._id })
              .populate("user");

            console.log("Notifying captains about new ride:", ride._id);
            console.log(
              "Ride with user data:",
              JSON.stringify({
                _id: rideWithUser._id,
                pickup: rideWithUser.pickup,
                destination: rideWithUser.destination,
                fare: rideWithUser.fare,
                user: {
                  _id: rideWithUser.user?._id,
                  name: rideWithUser.user?.name,
                  phoneNumber: rideWithUser.user?.phoneNumber,
                },
              })
            );
            let notifiedCount = 0;

            captainsInRadius.forEach((captain) => {
              console.log(
                `Captain ${captain._id}, socketId: ${captain.socketId}`
              );
              if (captain.socketId) {
                io.to(captain.socketId).emit("new-ride", rideWithUser);
                notifiedCount++;
                console.log(
                  `Emitted new-ride to captain ${captain._id} via socket ${captain.socketId}`
                );
              } else {
                console.log(`Captain ${captain._id} has no socketId`);
              }
            });

            console.log(`Successfully notified ${notifiedCount} captains`);
          } else {
            if (!io) {
              console.log("Socket.IO not available - cannot notify captains");
            }
            if (captainsInRadius.length === 0) {
              console.log("No captains found in radius");
            }
          }
        } catch (notificationError) {
          console.error("Error notifying captains:", notificationError);
          console.error("Stack trace:", notificationError.stack);
        }
      }

      res.status(200).json({
        success: true,
        message: "Order confirmed and ride created!",
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
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
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
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
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
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      // Only allow valid status transitions
      if (req.body.status === "Cancelled" && order.status === "Pending") {
        order.status = "Cancelled";
      } else if (
        req.body.status === "Confirmed by Shop" &&
        order.status === "Pending"
      ) {
        order.status = "Confirmed by Shop";
      } else if (
        [
          "Transferred to delivery partner",
          "Shipping",
          "Received",
          "On the way",
          "Delivered",
        ].includes(req.body.status) &&
        order.status !== "Cancelled"
      ) {
        order.status = req.body.status;
      }

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        await updateSellerInfo(order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

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

        seller.availableBalance = amount;

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
