const rideService = require("../utils/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../utils/maps.service");
const rideModel = require("../model/ride.model");
const cloudinary = require("cloudinary");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    res.status(201).json(ride);

    // Background processing for notifying captains
    try {
      const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
      console.log("Pickup coordinates:", pickupCoordinates);

      const captainsInRadius = await mapService.getCaptainsInTheRadius(
        pickupCoordinates.ltd,
        pickupCoordinates.lng,
        2
      );

      console.log("Captains found in radius:", captainsInRadius.length);

      ride.otp = "";

      const rideWithUser = await rideModel
        .findOne({ _id: ride._id })
        .populate("user");

      console.log("Ride with user:", rideWithUser);

      // Send to socket - will be handled by socket service
      const io = req.app.get("io");
      if (io) {
        captainsInRadius.forEach((captain) => {
          console.log(
            `Sending ride to captain ${captain._id} with socketId: ${captain.socketId}`
          );
          if (captain.socketId) {
            io.to(captain.socketId).emit("new-ride", rideWithUser);
          }
        });
      }
    } catch (notificationError) {
      console.error("Error notifying captains:", notificationError);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.confirmRide = async (req, res) => {
  console.log("=== Confirm Ride Controller ===");
  console.log("Request body:", req.body);
  console.log("Captain:", req.captain?._id);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    console.log("Confirming ride:", rideId);
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    console.log("Ride confirmed successfully:", ride._id);

    const io = req.app.get("io");

    // Notify user about ride confirmation
    if (io && ride.user.socketId) {
      console.log("Emitting ride-confirmed to user:", ride.user._id);
      io.to(ride.user.socketId).emit("ride-confirmed", ride);
    }

    // NEW: Notify shop/cook about captain acceptance
    if (io && (ride.order || ride.orderId)) {
      const rideOrderId = String(ride.order || ride.orderId);
      console.log("Fetching order for ride:", rideOrderId);
      const Order = require("../model/order");
      const order = await Order.findById(rideOrderId);

      if (order && order.cart && order.cart[0] && order.cart[0].shopId) {
        const shopId = order.cart[0].shopId;
        console.log("Notifying shop about ride acceptance:", shopId);

        // Get ride with OTP to send to shop
        const Ride = require("../model/ride.model");
        const rideWithOTP = await Ride.findById(ride._id).select("+otp");

        // IMPORTANT: Save OTP AND RIDE REFERENCE to order so cook can see it anytime
        const updatedOrder = await Order.findByIdAndUpdate(
          rideOrderId,
          {
            ride: ride._id, // 🔥 CRITICAL: Link the ride to the order
            rideStatus: "accepted",
            rideOTP: rideWithOTP.otp,
          },
          { new: true } // Return updated document
        );

        console.log("✅ OTP and Ride saved to order successfully!");
        console.log("Order ID:", updatedOrder._id);
        console.log("Ride ID:", updatedOrder.ride);
        console.log("Ride Status:", updatedOrder.rideStatus);
        console.log("Ride OTP:", updatedOrder.rideOTP);

        // Emit to shop's room (shops join with their ID as room)
        console.log("🚀 Emitting ride-accepted to shop room:", shopId);
        console.log("Event payload:", {
          orderId: rideOrderId,
          ride: {
            _id: rideWithOTP._id,
            status: rideWithOTP.status,
            otp: rideWithOTP.otp,
          },
        });

        io.to(shopId).emit("ride-accepted", {
          orderId: rideOrderId,
          ride: {
            _id: rideWithOTP._id,
            status: rideWithOTP.status,
            otp: rideWithOTP.otp,
            captain: {
              _id: req.captain._id,
              fullname: req.captain.fullname,
              phoneNumber: req.captain.phoneNumber,
              vehicle: req.captain.vehicle,
              profileImage: req.captain.profileImage,
            },
          },
        });

        console.log("✅ Socket event emitted successfully!");

        // Also emit to shop's socketId as backup
        const Shop = require("../model/shop");
        const shop = await Shop.findById(shopId);
        if (shop && shop.socketId) {
          console.log("📡 Also emitting to shop socketId:", shop.socketId);
          io.to(shop.socketId).emit("ride-accepted", {
            orderId: rideOrderId,
            ride: {
              _id: rideWithOTP._id,
              status: rideWithOTP.status,
              otp: rideWithOTP.otp,
              captain: {
                _id: req.captain._id,
                fullname: req.captain.fullname,
                phoneNumber: req.captain.phoneNumber,
                vehicle: req.captain.vehicle,
                profileImage: req.captain.profileImage,
              },
            },
          });
        }

        console.log("Shop notification sent for order:", ride.orderId);
      }
    }

    // Return ride with OTP for captain to see
    const Ride = require("../model/ride.model");
    const rideWithOTP = await Ride.findById(ride._id)
      .populate("user")
      .populate("captain")
      .populate("orderId")
      .select("+otp");

    return res.status(200).json(rideWithOTP);
  } catch (err) {
    console.error("Error confirming ride:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    console.log(ride);

    // Update order status to "On the way" when ride starts
    if (ride.order) {
      const Order = require("../model/order");
      const updatedOrder = await Order.findByIdAndUpdate(
        ride.order,
        { status: "On the way" },
        { new: true }
      );

      console.log("Order status updated to 'On the way':", updatedOrder?._id);

      // Notify shop about ride start
      if (updatedOrder?.cart?.[0]?.shopId) {
        const Shop = require("../model/shop");
        const shop = await Shop.findById(updatedOrder.cart[0].shopId);

        const io = req.app.get("io");
        if (io && shop && shop.socketId) {
          console.log("Notifying shop about ride start");
          io.to(shop.socketId).emit("ride-started", {
            orderId: updatedOrder._id,
            status: "On the way",
            rideId: ride._id,
          });
        }
      }
    }

    const io = req.app.get("io");
    if (io && ride.user.socketId) {
      io.to(ride.user.socketId).emit("ride-started", ride);
    }

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports.endRide = async (req, res) => {
  console.log("=== End Ride Controller ===");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, completionImage } = req.body;

  try {
    console.log("Ending ride:", rideId);
    console.log("Has completion image:", !!completionImage);

    // Upload completion evidence image to Cloudinary if provided
    let completionEvidence = null;
    if (completionImage) {
      try {
        console.log("Uploading completion evidence to Cloudinary...");
        const myCloud = await cloudinary.v2.uploader.upload(completionImage, {
          folder: "ride-completions",
          width: 1200,
          crop: "scale",
        });

        completionEvidence = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };

        console.log("Completion evidence uploaded:", completionEvidence.url);
      } catch (uploadError) {
        console.error("Error uploading completion evidence:", uploadError);
        // Continue even if image upload fails
      }
    }

    const ride = await rideService.endRide({
      rideId,
      captain: req.captain,
      completionEvidence,
    });

    console.log("Ride ended successfully. Status:", ride.status);

    // Move completed ride to CompletedRide collection
    const CompletedRide = require("../model/completedRide.model");
    const completedRideData = {
      user: ride.user._id || ride.user,
      captain: ride.captain._id || ride.captain,
      order: ride.order,
      pickup: ride.pickup,
      destination: ride.destination,
      fare: ride.fare,
      status: "completed",
      duration: ride.duration,
      distance: ride.distance,
      paymentID: ride.paymentID,
      orderId: ride.orderId,
      signature: ride.signature,
      otp: ride.otp,
      completionEvidence: completionEvidence,
      completedAt: new Date(),
      createdAt: ride.createdAt,
    };

    const completedRide = await CompletedRide.create(completedRideData);
    console.log(
      "✅ Ride moved to CompletedRide collection:",
      completedRide._id
    );

    // Delete ride from PendingRide collection
    await rideModel.findByIdAndDelete(rideId);
    console.log("✅ Ride removed from PendingRide collection");

    // Update order status to Delivered if ride has an order
    if (ride.order) {
      const Order = require("../model/order");
      const updatedOrder = await Order.findByIdAndUpdate(
        ride.order,
        { status: "Delivered" },
        { new: true }
      ).populate("user");

      console.log("Order status updated to Delivered:", updatedOrder?._id);

      // Notify user and shop about delivery completion
      const io = req.app.get("io");

      // Notify customer (user)
      if (io && updatedOrder?.user?.socketId) {
        console.log("Notifying customer about delivery completion");
        io.to(updatedOrder.user.socketId).emit("order-delivered", {
          orderId: updatedOrder._id,
          status: "Delivered",
        });
      }

      // Notify shop (cook)
      if (io && updatedOrder?.cart?.[0]?.shopId) {
        const Shop = require("../model/shop");
        const shop = await Shop.findById(updatedOrder.cart[0].shopId);

        if (shop && shop.socketId) {
          console.log("Notifying shop about delivery completion");
          io.to(shop.socketId).emit("order-delivered", {
            orderId: updatedOrder._id,
            status: "Delivered",
          });
        }
      }
    }

    // Also notify user via ride-ended event
    const io = req.app.get("io");
    if (io && ride.user.socketId) {
      console.log("Emitting ride-ended to user");
      io.to(ride.user.socketId).emit("ride-ended", ride);
    }

    // Captain earnings and ride statistics are already updated in ride.service.js
    console.log("✅ Ride completion process finished successfully");

    return res.status(200).json(ride);
  } catch (err) {
    console.error("Error ending ride:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports.getPendingRides = async (req, res) => {
  console.log("=== Get Pending Rides Controller ===");
  console.log("Captain:", req.captain?._id);
  console.log("Captain Location:", req.captain?.location);

  try {
    const captain = req.captain;

    if (!captain) {
      return res.status(401).json({
        message: "Captain not authenticated",
      });
    }

    // If captain location is not available, return all pending rides without distance filtering
    if (
      !captain.location ||
      (!captain.location.ltd && !captain.location.lat) ||
      !captain.location.lng
    ) {
      console.log(
        "Captain location not available, returning all UNACCEPTED pending rides"
      );
      // Only show rides that are pending and not accepted by anyone
      const allPendingRides = await rideModel
        .find({
          status: "pending",
          captain: null, // Not accepted by any captain yet
        })
        .populate("user")
        .populate("orderId");

      return res.status(200).json({
        rides: allPendingRides,
        message:
          "Location not available. Showing all new pending rides. Please wait for location update.",
      });
    }

    // Use lat if available, otherwise fall back to ltd for backward compatibility
    const latitude = captain.location.lat || captain.location.ltd;
    const longitude = captain.location.lng;

    console.log(
      `Searching for NEW pending rides near: lat=${latitude}, lng=${longitude}`
    );

    // Get only UNACCEPTED pending rides within 5km radius
    const pendingRides = await rideService.getUnacceptedPendingRidesInRadius(
      latitude,
      longitude,
      5 // 5km radius
    );

    console.log(
      `Found ${pendingRides.length} unaccepted pending rides within 5km`
    );

    return res.status(200).json({
      rides: pendingRides,
    });
  } catch (err) {
    console.error("Error fetching pending rides:", err);
    return res.status(500).json({
      message: err.message,
      error: err.toString(),
    });
  }
};

// NEW: Get captain's accepted/in-progress rides
module.exports.getMyCaptainRides = async (req, res) => {
  console.log("=== Get My Captain Rides Controller ===");
  console.log("Captain ID:", req.captain?._id);

  try {
    const captain = req.captain;

    if (!captain) {
      console.log("❌ No captain authenticated");
      return res.status(401).json({
        message: "Captain not authenticated",
      });
    }

    // Debug: Check all rides with this captain (any status)
    const allCaptainRides = await rideModel.find({ captain: captain._id });
    console.log(
      `📊 Total rides assigned to captain: ${allCaptainRides.length}`
    );
    allCaptainRides.forEach((r) => {
      console.log(`   - Ride ${r._id}: Status=${r.status}`);
    });

    // Get rides that this captain has accepted or are ongoing
    const myRides = await rideModel
      .find({
        captain: captain._id,
        status: { $in: ["accepted", "ongoing"] }, // Accepted or ongoing rides
      })
      .populate("user")
      .populate("order")
      .sort({ createdAt: -1 });

    console.log(
      `✅ Found ${myRides.length} active rides for captain ${captain._id}`
    );

    // Log each ride's status for debugging
    myRides.forEach((ride, index) => {
      console.log(
        `  Ride ${index + 1}: ID=${ride._id}, Status=${ride.status}, Captain=${
          ride.captain
        }`
      );
    });

    return res.status(200).json({
      rides: myRides,
      count: myRides.length,
    });
  } catch (err) {
    console.error("❌ Error fetching captain rides:", err);
    return res.status(500).json({
      message: err.message,
      error: err.toString(),
    });
  }
};

// Get single ride with OTP
module.exports.getRideById = async (req, res) => {
  try {
    const { rideId } = req.params;

    console.log("🔍 Fetching ride by ID with OTP:", rideId);

    const ride = await rideModel
      .findById(rideId)
      .populate("user")
      .populate("captain")
      .populate("order")
      .select("+otp"); // EXPLICITLY INCLUDE OTP

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    console.log("✅ Found ride with OTP:", ride.otp);

    res.status(200).json({
      success: true,
      ride,
    });
  } catch (err) {
    console.error("❌ Error fetching ride:", err);
    return res.status(500).json({
      message: err.message,
      error: err.toString(),
    });
  }
};

// Get captain's completed ride history
module.exports.getCaptainRideHistory = async (req, res) => {
  console.log("=== Get Captain Ride History Controller ===");
  console.log("Request headers:", req.headers);
  console.log("Captain from middleware:", req.captain?._id);

  try {
    const captain = req.captain;

    if (!captain) {
      console.log("❌ No captain authenticated");
      return res.status(401).json({
        success: false,
        message: "Captain not authenticated",
      });
    }

    console.log("✅ Captain authenticated, fetching completed rides...");

    const CompletedRide = require("../model/completedRide.model");

    // Get completed rides for this captain
    const completedRides = await CompletedRide.find({
      captain: captain._id,
      status: "completed",
    })
      .populate("user")
      .populate("order")
      .sort({ completedAt: -1 }); // Sort by completion date, newest first

    console.log(
      `✅ Found ${completedRides.length} completed rides for captain ${captain._id}`
    );

    return res.status(200).json({
      success: true,
      rides: completedRides,
      count: completedRides.length,
    });
  } catch (err) {
    console.error("❌ Error fetching captain ride history:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: err.toString(),
    });
  }
};
