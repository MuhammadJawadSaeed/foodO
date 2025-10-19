const captainModel = require("../model/captain.model");
const captainService = require("../utils/captain.service");
const blackListTokenModel = require("../model/blacklistToken.model");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary");
const { validateAndFormatPhone } = require("../utils/phoneValidator");
const { validateAndFormatCNIC } = require("../utils/cnicValidator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      fullname,
      email,
      password,
      phoneNumber,
      cnicNumber,
      address,
      city,
      cnicImage,
      drivingLicense,
      vehicleImage,
      profileImage,
      vehicle,
    } = req.body;

    console.log("Registration attempt with phone:", phoneNumber);
    console.log("Registration attempt with CNIC:", cnicNumber);
    console.log("Registration attempt with city:", city);

    // Validate and format CNIC number
    let formattedCNIC;
    try {
      formattedCNIC = validateAndFormatCNIC(cnicNumber);
      console.log("CNIC validated successfully:", formattedCNIC.digits);
    } catch (error) {
      console.log("CNIC validation error:", error.message);
      return res.status(400).json({ message: error.message });
    }

    // Validate and format phone number
    let formattedPhone;
    try {
      formattedPhone = validateAndFormatPhone(phoneNumber);
      console.log("Phone validated successfully:", formattedPhone.local);
    } catch (error) {
      console.log("Phone validation error:", error.message);
      return res.status(400).json({ message: error.message });
    }

    // Check if captain already exists
    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
      return res.status(400).json({ message: "Captain already exist" });
    }

    // Check if CNIC already registered (use digits-only format)
    const cnicExists = await captainModel.findOne({
      cnicNumber: formattedCNIC.digits,
    });
    if (cnicExists) {
      return res.status(400).json({ message: "CNIC already registered" });
    }

    // Check if phone number already registered
    const phoneExists = await captainModel.findOne({
      phoneNumber: formattedPhone.local,
    });
    if (phoneExists) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    // Upload CNIC Image to Cloudinary
    const cnicImageUpload = await cloudinary.v2.uploader.upload(cnicImage, {
      folder: "captain-documents/cnic",
      width: 1200,
      crop: "scale",
    });

    // Upload Driving License to Cloudinary
    const drivingLicenseUpload = await cloudinary.v2.uploader.upload(
      drivingLicense,
      {
        folder: "captain-documents/license",
        width: 1200,
        crop: "scale",
      }
    );

    // Upload Vehicle Image to Cloudinary
    const vehicleImageUpload = await cloudinary.v2.uploader.upload(
      vehicleImage,
      {
        folder: "captain-documents/vehicle",
        width: 1200,
        crop: "scale",
      }
    );

    // Upload Profile Image to Cloudinary (optional)
    let profileImageData = null;
    if (profileImage && profileImage.startsWith("data:image")) {
      const profileImageUpload = await cloudinary.v2.uploader.upload(
        profileImage,
        {
          folder: "captain-profiles",
          width: 500,
          height: 500,
          crop: "fill",
        }
      );
      profileImageData = {
        public_id: profileImageUpload.public_id,
        url: profileImageUpload.secure_url,
      };
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      phoneNumber: formattedPhone.local, // Store formatted local number
      cnicNumber: formattedCNIC.digits, // Store digits-only format
      address,
      city: city.toLowerCase().trim(), // Store city in lowercase
      cnicImage: {
        public_id: cnicImageUpload.public_id,
        url: cnicImageUpload.secure_url,
      },
      drivingLicense: {
        public_id: drivingLicenseUpload.public_id,
        url: drivingLicenseUpload.secure_url,
      },
      vehicleImage: {
        public_id: vehicleImageUpload.public_id,
        url: vehicleImageUpload.secure_url,
      },
      profileImage: profileImageData,
      plate: vehicle.plate,
      vehicleType: "motorcycle",
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
  } catch (error) {
    console.error("Error registering captain:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, captain });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.clearCookie("token");

  res.status(200).json({ message: "Logout successfully" });
};

// Update captain profile
module.exports.updateCaptainProfile = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    const { firstname, lastname, phoneNumber, address, plate, profileImage } =
      req.body;

    const captain = await captainModel.findById(captainId);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    // Update basic info
    if (firstname) captain.fullname.firstname = firstname;
    if (lastname) captain.fullname.lastname = lastname;

    // Validate and format phone number if provided
    if (phoneNumber) {
      try {
        const formattedPhone = validateAndFormatPhone(phoneNumber);
        // Check if phone number is already used by another captain
        const phoneExists = await captainModel.findOne({
          phoneNumber: formattedPhone.local,
          _id: { $ne: captainId }, // Exclude current captain
        });
        if (phoneExists) {
          return res
            .status(400)
            .json({ message: "Phone number already in use" });
        }
        captain.phoneNumber = formattedPhone.local;
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    if (address) captain.address = address;
    if (plate) captain.vehicle.plate = plate;

    // Update profile image if provided
    if (profileImage && profileImage.startsWith("data:image")) {
      // Delete old profile image from cloudinary if exists
      if (captain.profileImage.public_id) {
        await cloudinary.v2.uploader.destroy(captain.profileImage.public_id);
      }

      // Upload new profile image
      const profileImageUpload = await cloudinary.v2.uploader.upload(
        profileImage,
        {
          folder: "captain-profiles",
          width: 500,
          height: 500,
          crop: "fill",
        }
      );

      captain.profileImage = {
        public_id: profileImageUpload.public_id,
        url: profileImageUpload.secure_url,
      };
    }

    await captain.save();

    res.status(200).json({
      message: "Profile updated successfully",
      captain,
    });
  } catch (error) {
    console.error("Error updating captain profile:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// Update captain earnings when ride is completed
module.exports.updateCaptainEarnings = async (req, res, next) => {
  try {
    const { captainId, fareAmount } = req.body;

    if (!captainId || !fareAmount) {
      return res
        .status(400)
        .json({ message: "Captain ID and fare amount required" });
    }

    const captain = await captainModel.findById(captainId);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Reset daily stats if needed
    if (captain.lastDayReset && new Date(captain.lastDayReset) < today) {
      captain.earnings.today = 0;
      captain.rideStats.todayRides = 0;
      captain.hoursOnline.today = 0;
      captain.lastDayReset = now;
    }

    // Reset weekly stats if needed (assuming week starts on Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
    );
    startOfWeek.setHours(0, 0, 0, 0);

    if (
      captain.lastWeekReset &&
      new Date(captain.lastWeekReset) < startOfWeek
    ) {
      captain.earnings.thisWeek = 0;
      captain.rideStats.thisWeekRides = 0;
      captain.hoursOnline.thisWeek = 0;
      captain.lastWeekReset = now;
    }

    // Reset monthly stats if needed
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (
      captain.lastMonthReset &&
      new Date(captain.lastMonthReset) < startOfMonth
    ) {
      captain.earnings.thisMonth = 0;
      captain.rideStats.thisMonthRides = 0;
      captain.hoursOnline.thisMonth = 0;
      captain.lastMonthReset = now;
    }

    // Update earnings
    captain.earnings.total += fareAmount;
    captain.earnings.today += fareAmount;
    captain.earnings.thisWeek += fareAmount;
    captain.earnings.thisMonth += fareAmount;

    // Update ride stats
    captain.rideStats.totalRides += 1;
    captain.rideStats.completedRides += 1;
    captain.rideStats.todayRides += 1;
    captain.rideStats.thisWeekRides += 1;
    captain.rideStats.thisMonthRides += 1;

    await captain.save();

    res.status(200).json({
      message: "Earnings updated successfully",
      earnings: captain.earnings,
      rideStats: captain.rideStats,
    });
  } catch (error) {
    console.error("Error updating captain earnings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Start tracking online hours
module.exports.startOnlineSession = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    const captain = await captainModel.findById(captainId);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    captain.hoursOnline.lastSessionStart = new Date();
    captain.status = "active";
    await captain.save();

    res.status(200).json({ message: "Online session started" });
  } catch (error) {
    console.error("Error starting online session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// End tracking online hours
module.exports.endOnlineSession = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    const captain = await captainModel.findById(captainId);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    if (captain.hoursOnline.lastSessionStart) {
      const sessionDuration =
        (new Date() - new Date(captain.hoursOnline.lastSessionStart)) / 60000; // in minutes

      captain.hoursOnline.total += sessionDuration;
      captain.hoursOnline.today += sessionDuration;
      captain.hoursOnline.thisWeek += sessionDuration;
      captain.hoursOnline.thisMonth += sessionDuration;
      captain.hoursOnline.lastSessionStart = null;
    }

    captain.status = "inactive";
    await captain.save();

    res.status(200).json({
      message: "Online session ended",
      hoursOnline: captain.hoursOnline,
    });
  } catch (error) {
    console.error("Error ending online session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get captain statistics
module.exports.getCaptainStats = async (req, res, next) => {
  try {
    const captainId = req.captain._id;
    const captain = await captainModel.findById(captainId);

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    // Initialize new fields if they don't exist (for existing captains)
    if (!captain.rideFeeEarnings) {
      captain.rideFeeEarnings = {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      };
    }
    if (!captain.orderFeeEarnings) {
      captain.orderFeeEarnings = {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Check if we need to reset daily stats
    if (captain.lastDayReset && new Date(captain.lastDayReset) < today) {
      captain.earnings.today = 0;
      if (captain.rideFeeEarnings) captain.rideFeeEarnings.today = 0;
      if (captain.orderFeeEarnings) captain.orderFeeEarnings.today = 0;
      captain.rideStats.todayRides = 0;
      captain.hoursOnline.today = 0;
      captain.lastDayReset = now;
    }

    // Check if we need to reset weekly stats
    if (
      captain.lastWeekReset &&
      new Date(captain.lastWeekReset) < startOfWeek
    ) {
      captain.earnings.thisWeek = 0;
      if (captain.rideFeeEarnings) captain.rideFeeEarnings.thisWeek = 0;
      if (captain.orderFeeEarnings) captain.orderFeeEarnings.thisWeek = 0;
      captain.rideStats.thisWeekRides = 0;
      captain.hoursOnline.thisWeek = 0;
      captain.lastWeekReset = now;
    }

    // Check if we need to reset monthly stats
    if (
      captain.lastMonthReset &&
      new Date(captain.lastMonthReset) < startOfMonth
    ) {
      captain.earnings.thisMonth = 0;
      if (captain.rideFeeEarnings) captain.rideFeeEarnings.thisMonth = 0;
      if (captain.orderFeeEarnings) captain.orderFeeEarnings.thisMonth = 0;
      captain.rideStats.thisMonthRides = 0;
      captain.hoursOnline.thisMonth = 0;
      captain.lastMonthReset = now;
    }

    // Calculate current session time if online
    let currentSessionTime = 0;
    if (captain.hoursOnline.lastSessionStart) {
      currentSessionTime =
        (new Date() - new Date(captain.hoursOnline.lastSessionStart)) / 60000; // in minutes
    }

    await captain.save();

    const response = {
      earnings: captain.earnings,
      rideFeeEarnings: captain.rideFeeEarnings || {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      },
      orderFeeEarnings: captain.orderFeeEarnings || {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      },
      hoursOnline: {
        total: captain.hoursOnline.total,
        today: captain.hoursOnline.today + currentSessionTime,
        thisWeek: captain.hoursOnline.thisWeek + currentSessionTime,
        thisMonth: captain.hoursOnline.thisMonth + currentSessionTime,
      },
      rideStats: captain.rideStats,
      currentSessionTime,
    };

    console.log("📊 Captain Stats Response:", {
      captainId: captain._id,
      totalEarnings: response.earnings.total,
      weeklyData: {
        rides: response.rideStats.thisWeekRides,
        hours: (response.hoursOnline.thisWeek / 60).toFixed(1),
        totalEarnings: response.earnings.thisWeek,
        rideFee: response.rideFeeEarnings.thisWeek,
        orderFee: response.orderFeeEarnings.thisWeek,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error getting captain stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
