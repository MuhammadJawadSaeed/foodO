const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  console.log("=== isSeller Middleware ===");
  console.log("Cookies received:", req.cookies);

  const { seller_token } = req.cookies;

  if (!seller_token) {
    console.log("No seller_token found in cookies");
    return next(new ErrorHandler("Please login to continue", 401));
  }

  console.log("seller_token found, verifying...");
  const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
  console.log("Token decoded, seller ID:", decoded.id);

  req.seller = await Shop.findById(decoded.id);
  console.log("Seller loaded:", req.seller ? req.seller._id : "Not found");

  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }
    next();
  };
};
