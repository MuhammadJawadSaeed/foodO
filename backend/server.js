const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const http = require("http");
const socketIO = require("socket.io");
const User = require("./model/user");
const Captain = require("./model/captain.model");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = socketIO(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
});

// Make io accessible to routes
app.set("io", io);

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle user/captain joining
  socket.on("join", async (data) => {
    const { userId, userType } = data;

    console.log(
      `User joining: ${userId}, Type: ${userType}, SocketId: ${socket.id}`
    );

    if (userType === "user") {
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(`User ${userId} connected with socketId: ${socket.id}`);
    } else if (userType === "captain") {
      await Captain.findByIdAndUpdate(userId, {
        socketId: socket.id,
        status: "active",
      });
      console.log(
        `Captain ${userId} is now active with socketId: ${socket.id}`
      );
    } else if (userType === "shop") {
      const Shop = require("./model/shop");
      await Shop.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(`Shop ${userId} connected with socketId: ${socket.id}`);
    }
  });

  // Handle captain location updates
  socket.on("update-location-captain", async (data) => {
    const { userId, location } = data;

    console.log(`Captain ${userId} updating location:`, location);

    if (!location || (!location.lat && !location.ltd) || !location.lng) {
      console.log("Invalid location data:", location);
      return socket.emit("error", { message: "Invalid location data" });
    }

    // Support both 'lat' and 'ltd' for backward compatibility
    const latitude = location.lat || location.ltd;

    await Captain.findByIdAndUpdate(userId, {
      location: {
        lat: latitude,
        lng: location.lng,
      },
    });

    console.log(
      `Captain ${userId} location updated: lat=${latitude}, lng=${location.lng}`
    );
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
