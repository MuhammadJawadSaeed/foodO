const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");
const { validateAndFormatPhone } = require("../utils/phoneValidator");

// // create shop
// router.post("/create-shop", catchAsyncErrors(async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     const sellerEmail = await Shop.findOne({ email });
//     if (sellerEmail) {
//       return next(new ErrorHandler("User already exists", 400));
//     }

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//       folder: "avatars",
//     });

//     const seller = {
//       name: req.body.name,
//       email: email,
//       password: req.body.password,
//       avatar: {
//         public_id: myCloud.public_id,
//         url: myCloud.secure_url,
//       },
//       address: req.body.address,
//       phoneNumber: req.body.phoneNumber,
//       zipCode: req.body.zipCode,
//     };

//     const activationToken = createActivationToken(seller);

//     const activationUrl = `https://eshop-tutorial-pyri.vercel.app/seller/activation/${activationToken}`;

//     try {
//       await sendMail({
//         email: seller.email,
//         subject: "Activate your Shop",
//         message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`,
//       });
//       res.status(201).json({
//         success: true,
//         message: `please check your email:- ${seller.email} to activate your shop!`,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   } catch (error) {
//     return next(new ErrorHandler(error.message, 400));
//   }
// }));

// // create activation token
// const createActivationToken = (seller) => {
//   return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
//     expiresIn: "5m",
//   });
// };

// // activate user
// router.post(
//   "/activation",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const { activation_token } = req.body;

//       const newSeller = jwt.verify(
//         activation_token,
//         process.env.ACTIVATION_SECRET
//       );

//       if (!newSeller) {
//         return next(new ErrorHandler("Invalid token", 400));
//       }
//       const { name, email, password, avatar, zipCode, address, phoneNumber } =
//         newSeller;

//       let seller = await Shop.findOne({ email });

//       if (seller) {
//         return next(new ErrorHandler("User already exists", 400));
//       }

//       seller = await Shop.create({
//         name,
//         email,
//         avatar,
//         password,
//         zipCode,
//         address,
//         phoneNumber,
//       });

//       sendShopToken(seller, 201, res);
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

// create shop without activation process
router.post(
  "/create-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        email,
        name,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
        city,
        country,
      } = req.body;

      const sellerEmail = await Shop.findOne({ email });
      if (sellerEmail) {
        return next(new ErrorHandler("User already exists", 400));
      }

      // Validate and format phone number
      let formattedPhone;
      if (phoneNumber) {
        try {
          formattedPhone = validateAndFormatPhone(phoneNumber);
          // Check if phone number already exists
          const phoneExists = await Shop.findOne({
            phoneNumber: formattedPhone.local,
          });
          if (phoneExists) {
            return next(
              new ErrorHandler("Phone number already registered", 400)
            );
          }
        } catch (error) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      const seller = await Shop.create({
        name,
        email,
        password,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        address,
        phoneNumber: formattedPhone ? formattedPhone.local : phoneNumber,
        zipCode,
        city,
        country,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// login shop
router.post(
  "/login-shop",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await Shop.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendShopToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load shop
router.get(
  "/getSeller",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out from shop
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("seller_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get shop info
router.get(
  "/get-shop-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shop = await Shop.findById(req.params.id);
      res.status(201).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update shop profile picture
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      let existsSeller = await Shop.findById(req.seller._id);

      const imageId = existsSeller.avatar.public_id;

      await cloudinary.v2.uploader.destroy(imageId);

      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existsSeller.save();

      res.status(200).json({
        success: true,
        seller: existsSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Backend (Express route to handle seller info update)

router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        name,
        description,
        address,
        phoneNumber,
        zipCode,
        city,
        country,
      } = req.body;

      const shop = await Shop.findById(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Seller not found", 404));
      }

      // Update allowed fields
      if (name !== undefined) shop.name = name;
      if (description !== undefined) shop.description = description;
      if (address !== undefined) shop.address = address;

      // Validate and format phone number if provided
      if (phoneNumber !== undefined) {
        try {
          const formattedPhone = validateAndFormatPhone(phoneNumber);
          // Check if phone number already used by another shop
          const phoneExists = await Shop.findOne({
            phoneNumber: formattedPhone.local,
            _id: { $ne: req.seller._id },
          });
          if (phoneExists) {
            return next(new ErrorHandler("Phone number already in use", 400));
          }
          shop.phoneNumber = formattedPhone.local;
        } catch (error) {
          return next(new ErrorHandler(error.message, 400));
        }
      }

      if (zipCode !== undefined) shop.zipCode = zipCode;
      if (city !== undefined) shop.city = city; // Ensure the 'city' is updated here
      if (country !== undefined) shop.country = country;

      await shop.save();

      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update shop online/offline status
router.put(
  "/update-shop-status",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { isOnline } = req.body;

      if (isOnline === undefined) {
        return next(new ErrorHandler("isOnline field is required", 400));
      }

      const shop = await Shop.findById(req.seller._id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      shop.isOnline = isOnline;
      await shop.save();

      // Update all products with new shop status
      const Product = require("../model/product");
      await Product.updateMany(
        { shopId: shop._id.toString() },
        { $set: { "shop.isOnline": isOnline } }
      );

      res.status(200).json({
        success: true,
        shop,
        message: `Shop is now ${isOnline ? "online" : "offline"}`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);

      if (!seller) {
        return next(
          new ErrorHandler("Seller is not available with this id", 400)
        );
      }

      await Shop.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update seller withdraw methods --- sellers
router.put(
  "/update-payment-methods",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;

      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete seller withdraw merthods --- only seller
router.delete(
  "/delete-withdraw-method/",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found with this id", 400));
      }

      seller.withdrawMethod = null;

      await seller.save();

      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// block seller --- admin
router.put(
  "/block-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findByIdAndUpdate(
        req.params.id,
        { blocked: true },
        { new: true }
      );

      if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Seller blocked successfully!",
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// unblock seller --- admin
router.put(
  "/unblock-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const seller = await Shop.findByIdAndUpdate(
        req.params.id,
        { blocked: false },
        { new: true }
      );

      if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Seller unblocked successfully!",
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all cities with shop counts --- admin
router.get(
  "/admin-all-shop-cities",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const cities = await Shop.aggregate([
        {
          $match: { city: { $exists: true, $ne: null, $ne: "" } },
        },
        {
          $group: {
            _id: "$city",
            shopCount: { $sum: 1 },
            activeShops: {
              $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] },
            },
            blockedShops: {
              $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] },
            },
            totalBalance: { $sum: "$availableBalance" },
          },
        },
        {
          $project: {
            city: "$_id",
            shopCount: 1,
            activeShops: 1,
            blockedShops: 1,
            totalBalance: 1,
            _id: 0,
          },
        },
        {
          $sort: { shopCount: -1 },
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

// get shops by city --- admin
router.get(
  "/admin-shops-by-city/:city",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { city } = req.params;

      // Try multiple query methods
      let shops = await Shop.find({
        city: { $regex: new RegExp(`^${city.trim()}$`, "i") },
      }).sort({ createdAt: -1 });

      // If no shops found, try lowercase
      if (shops.length === 0) {
        shops = await Shop.find({
          city: city.toLowerCase().trim(),
        }).sort({ createdAt: -1 });
      }

      // If still no shops, try partial match
      if (shops.length === 0) {
        shops = await Shop.find({
          city: { $regex: city.trim(), $options: "i" },
        }).sort({ createdAt: -1 });
      }

      res.status(200).json({
        success: true,
        shops,
        count: shops.length,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get full restaurant details --- admin
router.get(
  "/admin-restaurant-details/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const Product = require("../model/product");
      const Order = require("../model/order");

      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(new ErrorHandler("Restaurant not found", 404));
      }

      // Get all products for this shop
      const products = await Product.find({ shopId: req.params.id });

      // Get all orders for this shop
      const orders = await Order.find({
        "cart.shopId": req.params.id,
      }).sort({ createdAt: -1 });

      // Calculate statistics
      const totalProducts = products.length;
      const totalOrders = orders.length;

      const totalRevenue = orders.reduce((sum, order) => {
        const shopItems = order.cart.filter(
          (item) => item.shopId === req.params.id
        );
        return (
          sum +
          shopItems.reduce(
            (itemSum, item) => itemSum + item.discountPrice * item.qty,
            0
          )
        );
      }, 0);

      const pendingOrders = orders.filter(
        (o) =>
          o.status === "Processing" ||
          o.status === "Transferred to delivery partner"
      ).length;

      const completedOrders = orders.filter(
        (o) => o.status === "Delivered"
      ).length;

      // Calculate average rating from products
      const ratingsSum = products.reduce((sum, product) => {
        const avgRating =
          product.reviews && product.reviews.length > 0
            ? product.reviews.reduce((r, review) => r + review.rating, 0) /
              product.reviews.length
            : 0;
        return sum + avgRating;
      }, 0);

      const averageRating = totalProducts > 0 ? ratingsSum / totalProducts : 0;

      res.status(200).json({
        success: true,
        restaurant: {
          shop,
          products,
          orders: orders.slice(0, 20), // Latest 20 orders
          statistics: {
            totalProducts,
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders,
            averageRating: averageRating.toFixed(2),
            availableBalance: shop.availableBalance,
            isBlocked: shop.blocked,
            joinedDate: shop.createdAt,
          },
        },
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update shop commission rate ---admin
router.put(
  "/update-commission/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { commissionRate } = req.body;
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      shop.commissionRate = commissionRate;
      await shop.save();

      res.status(200).json({
        success: true,
        message: "Commission rate updated successfully",
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update shop balance ---admin
router.put(
  "/update-balance/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount, action } = req.body;
      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return next(new ErrorHandler("Shop not found", 404));
      }

      if (action === "add") {
        shop.availableBalance = (shop.availableBalance || 0) + amount;
      } else if (action === "deduct") {
        shop.availableBalance = (shop.availableBalance || 0) - amount;
      }

      await shop.save();

      res.status(200).json({
        success: true,
        message: `Balance ${
          action === "add" ? "added" : "deducted"
        } successfully`,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
