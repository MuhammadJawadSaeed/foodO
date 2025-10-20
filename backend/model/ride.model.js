const mongoose = require("mongoose");

const pendingRideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  pickup: {
    type: String,
    required: true,
  },
  pickupCoordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  destination: {
    type: String,
    required: true,
  },
  destinationCoordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  fare: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing"],
    default: "pending",
  },

  duration: {
    type: Number,
  }, // in seconds

  distance: {
    type: Number,
  }, // in meters

  paymentID: {
    type: String,
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },

  otp: {
    type: String,
    select: false,
    required: true,
  },

  // Completion Evidence
  completionEvidence: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },

  completedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("PendingRide", pendingRideSchema);
