const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      } else {
        let images = [];

        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;
        productData.city = shop.city; // Save the shop's city in the product

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }

      // Check if the product belongs to this seller
      if (product.shopId !== req.seller._id.toString()) {
        return next(
          new ErrorHandler("You are not authorized to delete this product", 403)
        );
      }

      // Delete images from cloudinary (don't fail if cloudinary deletion fails)
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          try {
            if (product.images[i].public_id) {
              await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }
          } catch (cloudinaryError) {
            console.error(
              `Failed to delete image from cloudinary: ${cloudinaryError.message}`
            );
            // Continue with deletion even if cloudinary fails
          }
        }
      }

      // Use findByIdAndDelete instead of deprecated remove()
      await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      console.error("Product deletion error:", error);
      return next(
        new ErrorHandler(error.message || "Failed to delete product", 400)
      );
    }
  })
);

// toggle product availability status
router.put(
  "/toggle-product-availability/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id", 404));
      }

      // Check if the product belongs to this seller
      if (product.shopId !== req.seller._id.toString()) {
        return next(
          new ErrorHandler("You are not authorized to update this product", 403)
        );
      }

      // Toggle the availability status
      product.isAvailable = !product.isAvailable;
      await product.save();

      res.status(200).json({
        success: true,
        message: `Product is now ${
          product.isAvailable ? "available" : "unavailable"
        }`,
        isAvailable: product.isAvailable,
      });
    } catch (error) {
      console.error("Toggle availability error:", error);
      return next(
        new ErrorHandler(
          error.message || "Failed to update product availability",
          400
        )
      );
    }
  })
);

// update product
router.put(
  "/update-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id", 404));
      }

      const {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        images,
      } = req.body;

      let imagesLinks = product.images;

      // If new images are provided, upload them
      if (images && images.length > 0) {
        // Delete old images from cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        imagesLinks = [];

        let imageArray = [];
        if (typeof images === "string") {
          imageArray.push(images);
        } else {
          imageArray = images;
        }

        for (let i = 0; i < imageArray.length; i++) {
          const result = await cloudinary.v2.uploader.upload(imageArray[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name,
          description,
          category,
          tags,
          originalPrice,
          discountPrice,
          images: imagesLinks,
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        product: updatedProduct,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const Shop = require("../model/shop");
      const products = await Product.find().sort({ createdAt: -1 });

      // Refresh shop status for each product
      const productsWithFreshShopData = await Promise.all(
        products.map(async (product) => {
          const shop = await Shop.findById(product.shopId).select("isOnline");
          if (shop) {
            const productObj = product.toObject();
            productObj.shop.isOnline = shop.isOnline;
            return productObj;
          }
          return product.toObject();
        })
      );

      res.status(201).json({
        success: true,
        products: productsWithFreshShopData,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
