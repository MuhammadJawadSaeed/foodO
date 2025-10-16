const rideService = require("../utils/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../utils/maps.service");
const rideModel = require("../model/ride.model");

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
    if (io && ride.user.socketId) {
      console.log("Emitting ride-confirmed to user:", ride.user._id);
      io.to(ride.user.socketId).emit("ride-confirmed", ride);
    }

    return res.status(200).json(ride);
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

  const { rideId } = req.body;

  try {
    console.log("Ending ride:", rideId);
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    console.log("Ride ended successfully. Status:", ride.status);

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
        "Captain location not available, returning all pending rides"
      );
      const allPendingRides = await rideService.getAllPendingRides();

      return res.status(200).json({
        rides: allPendingRides,
        message:
          "Location not available. Showing all pending rides. Please wait for location update.",
      });
    }

    // Use lat if available, otherwise fall back to ltd for backward compatibility
    const latitude = captain.location.lat || captain.location.ltd;
    const longitude = captain.location.lng;

    console.log(`Searching for rides near: lat=${latitude}, lng=${longitude}`);

    // Get all pending rides within a certain radius (increased to 100km for testing with dummy coordinates)
    const pendingRides = await rideService.getPendingRidesInRadius(
      latitude,
      longitude,
      100 // 100km radius (increased from 10km due to dummy coordinates issue)
    );

    console.log(`Found ${pendingRides.length} pending rides within 100km`);

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
