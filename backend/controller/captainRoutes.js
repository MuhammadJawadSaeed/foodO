const captainController = require("../controller/captain");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/captainAuth");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Captain = require("../model/captain.model");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("phoneNumber")
      .isLength({ min: 10, max: 15 })
      .withMessage("Phone number must be between 10 and 15 characters"),
    body("cnicNumber")
      .isLength({ min: 13, max: 15 })
      .withMessage(
        "CNIC number must be 13-15 characters (with or without dashes)"
      ),
    body("address")
      .isLength({ min: 10 })
      .withMessage("Address must be at least 10 characters long"),
    body("city")
      .isLength({ min: 3 })
      .withMessage("City must be at least 3 characters long"),
    body("cnicImage").notEmpty().withMessage("CNIC image is required"),
    body("drivingLicense")
      .notEmpty()
      .withMessage("Driving license image is required"),
    body("vehicleImage").notEmpty().withMessage("Vehicle image is required"),
    body("vehicle.plate")
      .isLength({ min: 3 })
      .withMessage("Plate must be at least 3 characters long"),
  ],
  captainController.registerCaptain
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  captainController.loginCaptain
);

router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

router.put(
  "/profile",
  authMiddleware.authCaptain,
  captainController.updateCaptainProfile
);

router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

router.post(
  "/update-earnings",
  authMiddleware.authCaptain,
  captainController.updateCaptainEarnings
);

router.post(
  "/start-session",
  authMiddleware.authCaptain,
  captainController.startOnlineSession
);

router.post(
  "/end-session",
  authMiddleware.authCaptain,
  captainController.endOnlineSession
);

router.get(
  "/stats",
  authMiddleware.authCaptain,
  captainController.getCaptainStats
);

// Admin routes for captain management

// get all captains --- admin
router.get(
  "/admin-all-captains",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const captains = await Captain.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        captains,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all cities with captain counts --- admin
router.get(
  "/admin-all-captain-cities",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const cities = await Captain.aggregate([
        {
          $match: { city: { $exists: true, $ne: null, $ne: "" } },
        },
        {
          $group: {
            _id: "$city",
            captainCount: { $sum: 1 },
            activeCaptains: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            inactiveCaptains: {
              $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
            },
            totalEarnings: { $sum: "$earnings.total" },
            totalRides: { $sum: "$rideStats.completedRides" },
          },
        },
        {
          $project: {
            city: "$_id",
            captainCount: 1,
            activeCaptains: 1,
            inactiveCaptains: 1,
            totalEarnings: 1,
            totalRides: 1,
            _id: 0,
          },
        },
        {
          $sort: { captainCount: -1 },
        },
      ]);

      res.status(200).json({
        success: true,
        cities,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get captains by city --- admin
router.get(
  "/admin-captains-by-city/:city",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { city } = req.params;
      const captains = await Captain.find({
        city: city.toLowerCase().trim(),
      }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        captains,
        count: captains.length,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get captain details --- admin
router.get(
  "/admin-captain-details/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const Ride = require("../model/ride.model");
      const CompletedRide = require("../model/completedRide.model");

      const captain = await Captain.findById(req.params.id);

      if (!captain) {
        return next(new ErrorHandler("Captain not found", 404));
      }

      // Get ride history
      const completedRides = await CompletedRide.find({
        captain: req.params.id,
      })
        .sort({ createdAt: -1 })
        .limit(20);

      res.status(200).json({
        success: true,
        captain: {
          profile: captain,
          rides: completedRides,
          statistics: {
            totalRides: captain.rideStats?.completedRides || 0,
            totalEarnings: captain.earnings?.total || 0,
            rideFeeEarnings: captain.rideFeeEarnings?.total || 0,
            orderFeeEarnings: captain.orderFeeEarnings?.total || 0,
            cancelledRides: captain.rideStats?.cancelledRides || 0,
            hoursOnline: captain.hoursOnline?.total || 0,
            status: captain.status,
            joinedDate: captain.createdAt,
          },
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update captain status (activate/deactivate) --- admin
router.put(
  "/admin-update-captain-status/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { status } = req.body; // 'active' or 'inactive'

      if (!["active", "inactive"].includes(status)) {
        return next(new ErrorHandler("Invalid status value", 400));
      }

      const captain = await Captain.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!captain) {
        return next(new ErrorHandler("Captain not found", 404));
      }

      res.status(200).json({
        success: true,
        message: `Captain ${
          status === "active" ? "activated" : "deactivated"
        } successfully!`,
        captain,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete captain --- admin
router.delete(
  "/admin-delete-captain/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const captain = await Captain.findByIdAndDelete(req.params.id);

      if (!captain) {
        return next(new ErrorHandler("Captain not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Captain deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
