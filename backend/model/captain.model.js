const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  cnicNumber: {
    type: String,
    required: true,
    unique: true,
  },

  address: {
    type: String,
    required: true,
  },

  city: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  // Document Images
  cnicImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  drivingLicense: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  vehicleImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  // Profile Image
  profileImage: {
    public_id: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "https://www.svgrepo.com/show/505031/uber-driver.svg",
    },
  },

  socketId: {
    type: String,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  vehicle: {
    plate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 3 characters long"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["motorcycle"],
      default: "motorcycle",
    },
  },

  location: {
    lat: {
      type: Number,
    },
    ltd: {
      // Keep for backward compatibility
      type: Number,
    },
    lng: {
      type: Number,
    },
  },

  // Earnings and Statistics
  earnings: {
    total: {
      type: Number,
      default: 0,
    },
    today: {
      type: Number,
      default: 0,
    },
    thisWeek: {
      type: Number,
      default: 0,
    },
    thisMonth: {
      type: Number,
      default: 0,
    },
  },

  // Ride Fee (Delivery charges only)
  rideFeeEarnings: {
    total: {
      type: Number,
      default: 0,
    },
    today: {
      type: Number,
      default: 0,
    },
    thisWeek: {
      type: Number,
      default: 0,
    },
    thisMonth: {
      type: Number,
      default: 0,
    },
  },

  // Order Fee (Food payment from COD)
  orderFeeEarnings: {
    total: {
      type: Number,
      default: 0,
    },
    today: {
      type: Number,
      default: 0,
    },
    thisWeek: {
      type: Number,
      default: 0,
    },
    thisMonth: {
      type: Number,
      default: 0,
    },
  },

  // Online Hours Tracking
  hoursOnline: {
    total: {
      type: Number,
      default: 0, // in minutes
    },
    today: {
      type: Number,
      default: 0, // in minutes
    },
    thisWeek: {
      type: Number,
      default: 0, // in minutes
    },
    thisMonth: {
      type: Number,
      default: 0, // in minutes
    },
    lastSessionStart: {
      type: Date,
    },
  },

  // Ride Statistics
  rideStats: {
    totalRides: {
      type: Number,
      default: 0,
    },
    completedRides: {
      type: Number,
      default: 0,
    },
    cancelledRides: {
      type: Number,
      default: 0,
    },
    todayRides: {
      type: Number,
      default: 0,
    },
    thisWeekRides: {
      type: Number,
      default: 0,
    },
    thisMonthRides: {
      type: Number,
      default: 0,
    },
  },

  // Last Reset Dates
  lastDayReset: {
    type: Date,
    default: Date.now,
  },
  lastWeekReset: {
    type: Date,
    default: Date.now,
  },
  lastMonthReset: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to initialize earnings and stats fields if they don't exist
captainSchema.pre("save", function (next) {
  // Initialize earnings if not exists
  if (!this.earnings) {
    this.earnings = {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
    };
  }

  // Initialize hoursOnline if not exists
  if (!this.hoursOnline) {
    this.hoursOnline = {
      total: 0,
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      lastSessionStart: null,
    };
  }

  // Initialize rideStats if not exists
  if (!this.rideStats) {
    this.rideStats = {
      totalRides: 0,
      completedRides: 0,
      cancelledRides: 0,
      todayRides: 0,
      thisWeekRides: 0,
      thisMonthRides: 0,
    };
  }

  // Initialize reset dates if not exists
  if (!this.lastDayReset) {
    this.lastDayReset = new Date();
  }
  if (!this.lastWeekReset) {
    this.lastWeekReset = new Date();
  }
  if (!this.lastMonthReset) {
    this.lastMonthReset = new Date();
  }

  next();
});

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model("captain", captainSchema);

module.exports = captainModel;
