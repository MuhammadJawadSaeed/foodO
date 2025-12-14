const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const User = require("../model/user");
const Shop = require("../model/shop");
const Captain = require("../model/captain.model");
const Order = require("../model/order");
const Product = require("../model/product");

// Get overall platform statistics
router.get(
  "/platform-overview",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Get all unique cities
      const userCities = await User.distinct("city");
      const shopCities = await Shop.distinct("city");
      const captainCities = await Captain.distinct("city");

      const allCities = [
        ...new Set([...userCities, ...shopCities, ...captainCities]),
      ].filter((c) => c);

      // Get overall counts
      const totalUsers = await User.countDocuments();
      const totalShops = await Shop.countDocuments();
      const totalCaptains = await Captain.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();

      // Calculate total revenue
      const orders = await Order.find({ status: "Delivered" });
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );

      // Active counts
      const activeUsers = await User.countDocuments({
        suspended: { $ne: true },
      });
      const activeShops = await Shop.countDocuments({ blocked: { $ne: true } });
      const activeCaptains = await Captain.countDocuments({ status: "active" });

      res.status(200).json({
        success: true,
        overview: {
          cities: allCities.length,
          totalUsers,
          activeUsers,
          suspendedUsers: totalUsers - activeUsers,
          totalShops,
          activeShops,
          blockedShops: totalShops - activeShops,
          totalCaptains,
          activeCaptains,
          inactiveCaptains: totalCaptains - activeCaptains,
          totalOrders,
          totalProducts,
          totalRevenue,
          allCities: allCities.sort(),
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get city-wise detailed analytics
router.get(
  "/city-analytics/:city",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { city } = req.params;
      const cityRegex = { $regex: new RegExp(`^${city.trim()}$`, "i") };

      // Users in this city
      const users = await User.find({ city: cityRegex });
      const activeUsers = users.filter((u) => !u.suspended).length;

      // Shops in this city
      const shops = await Shop.find({ city: cityRegex });
      const activeShops = shops.filter((s) => !s.blocked).length;

      // Captains in this city
      const captains = await Captain.find({ city: cityRegex });
      const activeCaptains = captains.filter(
        (c) => c.status === "active"
      ).length;

      // Get shop IDs for this city
      const shopIds = shops.map((s) => s._id.toString());

      // Orders for shops in this city
      const orders = await Order.find({
        "cart.shopId": { $in: shopIds },
      });

      // Calculate revenue
      const totalRevenue = orders.reduce((sum, order) => {
        const cityShopItems = order.cart.filter((item) =>
          shopIds.includes(item.shopId)
        );
        return (
          sum +
          cityShopItems.reduce(
            (itemSum, item) => itemSum + item.discountPrice * item.qty,
            0
          )
        );
      }, 0);

      // Order statistics
      const pendingOrders = orders.filter(
        (o) =>
          o.status === "Processing" ||
          o.status === "Transferred to delivery partner"
      ).length;
      const deliveredOrders = orders.filter(
        (o) => o.status === "Delivered"
      ).length;

      // Captain statistics
      const totalRides = captains.reduce(
        (sum, c) => sum + (c.rideStats?.completedRides || 0),
        0
      );
      const totalCaptainEarnings = captains.reduce(
        (sum, c) => sum + (c.earnings?.total || 0),
        0
      );

      // Shop statistics
      const totalShopBalance = shops.reduce(
        (sum, s) => sum + (s.availableBalance || 0),
        0
      );

      // Products in this city
      const products = await Product.find({ shopId: { $in: shopIds } });

      res.status(200).json({
        success: true,
        city: city,
        analytics: {
          users: {
            total: users.length,
            active: activeUsers,
            suspended: users.length - activeUsers,
          },
          shops: {
            total: shops.length,
            active: activeShops,
            blocked: shops.length - activeShops,
            totalBalance: totalShopBalance,
          },
          captains: {
            total: captains.length,
            active: activeCaptains,
            inactive: captains.length - activeCaptains,
            totalRides,
            totalEarnings: totalCaptainEarnings,
          },
          orders: {
            total: orders.length,
            pending: pendingOrders,
            delivered: deliveredOrders,
            revenue: totalRevenue,
          },
          products: {
            total: products.length,
          },
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get city comparison report
router.get(
  "/city-comparison",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Get all cities
      const userCities = await User.distinct("city");
      const shopCities = await Shop.distinct("city");
      const captainCities = await Captain.distinct("city");

      const allCities = [
        ...new Set([...userCities, ...shopCities, ...captainCities]),
      ].filter((c) => c);

      const cityData = [];

      for (const city of allCities) {
        const cityLower = city.toLowerCase().trim();

        const userCount = await User.countDocuments({ city: cityLower });
        const shopCount = await Shop.countDocuments({ city: cityLower });
        const captainCount = await Captain.countDocuments({ city: cityLower });

        const shops = await Shop.find({ city: cityLower });
        const shopIds = shops.map((s) => s._id.toString());

        const orders = await Order.find({
          "cart.shopId": { $in: shopIds },
        });

        const revenue = orders.reduce((sum, order) => {
          const cityShopItems = order.cart.filter((item) =>
            shopIds.includes(item.shopId)
          );
          return (
            sum +
            cityShopItems.reduce(
              (itemSum, item) => itemSum + item.discountPrice * item.qty,
              0
            )
          );
        }, 0);

        cityData.push({
          city,
          users: userCount,
          shops: shopCount,
          captains: captainCount,
          orders: orders.length,
          revenue,
        });
      }

      // Sort by revenue
      cityData.sort((a, b) => b.revenue - a.revenue);

      res.status(200).json({
        success: true,
        cities: cityData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get monthly trends for a city
router.get(
  "/city-monthly-trends/:city",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { city } = req.params;
      const cityLower = city.toLowerCase().trim();

      const shops = await Shop.find({ city: cityLower });
      const shopIds = shops.map((s) => s._id.toString());

      // Get last 12 months data
      const monthlyData = [];
      const now = new Date();

      for (let i = 11; i >= 0; i--) {
        const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const orders = await Order.find({
          "cart.shopId": { $in: shopIds },
          createdAt: { $gte: startDate, $lte: endDate },
        });

        const revenue = orders.reduce((sum, order) => {
          const cityShopItems = order.cart.filter((item) =>
            shopIds.includes(item.shopId)
          );
          return (
            sum +
            cityShopItems.reduce(
              (itemSum, item) => itemSum + item.discountPrice * item.qty,
              0
            )
          );
        }, 0);

        const newUsers = await User.countDocuments({
          city: cityLower,
          createdAt: { $gte: startDate, $lte: endDate },
        });

        const newShops = await Shop.countDocuments({
          city: cityLower,
          createdAt: { $gte: startDate, $lte: endDate },
        });

        monthlyData.push({
          month: startDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          orders: orders.length,
          revenue,
          newUsers,
          newShops,
        });
      }

      res.status(200).json({
        success: true,
        city,
        trends: monthlyData,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
