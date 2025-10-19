const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("./ride");
const authMiddleware = require("../middleware/captainAuth");
const { isAuthenticated } = require("../middleware/auth");

router.post(
  "/create",
  isAuthenticated,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
  rideController.createRide
);

router.get(
  "/get-fare",
  isAuthenticated,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  rideController.getFare
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  rideController.confirmRide
);

router.get(
  "/start-ride",
  authMiddleware.authCaptain,
  query("rideId").isMongoId().withMessage("Invalid ride id"),
  query("otp")
    .isString()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  rideController.startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  rideController.endRide
);

router.get(
  "/pending-rides",
  authMiddleware.authCaptain,
  rideController.getPendingRides
);

// Get captain's active rides (accepted/started)
router.get(
  "/my-rides",
  authMiddleware.authCaptain,
  rideController.getMyCaptainRides
);

// Get captain's completed ride history
router.get(
  "/ride-history",
  authMiddleware.authCaptain,
  rideController.getCaptainRideHistory
);

// Get single ride by ID with OTP (for shop to fetch OTP)
router.get("/:rideId", isAuthenticated, rideController.getRideById);

module.exports = router;
