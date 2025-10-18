const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// Load .env before requiring routes
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

// Allow CORS (for frontend requests)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Test route
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

// Import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
const captain = require("./controller/captainRoutes");
const ride = require("./controller/rideRoutes");

// Use routes
app.use("/user", user);
app.use("/conversation", conversation);
app.use("/message", message);
app.use("/order", order);
app.use("/shop", shop);
app.use("/product", product);
app.use("/coupon", coupon);
app.use("/payment", payment);
app.use("/withdraw", withdraw);
app.use("/captain", captain); // Singular for auth routes (login, register, profile)
app.use("/captains", captain); // Plural for stats routes (stats, start-session, end-session)
app.use("/rides", ride); // Changed from /ride to /rides to match frontend

// Global Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
