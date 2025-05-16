const express = require("express");
const mongoose = require("mongoose");
const Conversation = require("../model/conversation");
const Message = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller } = require("../middleware/auth");

const router = express.Router();

// Create New Conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;

      if (!userId || !sellerId) {
        return next(new ErrorHandler("User ID and Seller ID are required", 400));
      }

      const existingConversation = await Conversation.findOne({
        members: {
          $all: [
            mongoose.Types.ObjectId(userId),
            mongoose.Types.ObjectId(sellerId),
          ],
          $size: 2,
        },
      });

      if (existingConversation) {
        return res.status(200).json({
          success: true,
          message: "Conversation already exists",
          conversation: existingConversation,
        });
      }

      const newConversation = await Conversation.create({
        members: [userId, sellerId],
        groupTitle,
      });

      res.status(201).json({
        success: true,
        message: "New conversation created",
        conversation: newConversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get All Seller Conversations
router.get(
  "/get-all-conversation-seller/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get All User Conversations
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const conversations = await Conversation.find({
        members: {
          $in: [req.params.id],
        },
      }).sort({ updatedAt: -1 });

      res.status(200).json({
        success: true,
        conversations,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update Last Message
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;

      const conversation = await Conversation.findByIdAndUpdate(
        req.params.id,
        { lastMessage, lastMessageId },
        { new: true }
      );

      res.status(200).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;