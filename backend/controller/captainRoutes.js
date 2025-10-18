const captainController = require("../controller/captain");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/captainAuth");

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

module.exports = router;
