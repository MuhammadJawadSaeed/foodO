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
    origin: process.env.CLIENT_URL || "http://localhost:3000",
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

// Global Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
