import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

    const usersWithUnreadCount = await Promise.all(
      users.map(async (user) => {
        const unreadCount = await Message.countDocuments({
          senderId: user._id,
          receiverId: req.user._id,
          read: false,
        });

        return {
          ...user.toObject(),
          unreadCount,
        };
      })
    );

    // Emit event to update unread count for the current user
    const currentUserSocketId = getReceiverSocketId(req.user._id);
    console.log(`Emitting updateUnreadCount to current user ${req.user._id}, socketId: ${currentUserSocketId}`);
    if (currentUserSocketId) {
      io.to(currentUserSocketId).emit("updateUnreadCount");
    } else {
      console.log(`No socket found for current user ${req.user._id}`);
    }

    res.status(200).json(usersWithUnreadCount);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Mark messages as read
    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId, read: false },
      { read: true }
    );

    // Emit event to update unread count for both sender and receiver
    const senderSocketId = getReceiverSocketId(userToChatId);
    const receiverSocketId = getReceiverSocketId(myId);
    console.log(`Emitting updateUnreadCount to sender ${userToChatId}, socketId: ${senderSocketId}`);
    console.log(`Emitting updateUnreadCount to receiver ${myId}, socketId: ${receiverSocketId}`);
    if (senderSocketId) {
      io.to(senderSocketId).emit("updateUnreadCount");
    } else {
      console.log(`No socket found for sender ${userToChatId}`);
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("updateUnreadCount");
    } else {
      console.log(`No socket found for receiver ${myId}`);
    }

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

import { Readable } from "stream";

export const sendMessage = async (req, res) => {
  try {
    const { text, image, pdf } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let pdfUrl;

    // Helper function to convert base64 to stream
    const base64ToStream = (base64) => {
      const buffer = Buffer.from(base64.split(",")[1], "base64");
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      return stream;
    };

    if (image) {
      if (image.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: "Image size exceeds 5MB limit" });
      }
      // Upload base64 image as stream to Cloudinary
      const stream = base64ToStream(image);
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
      imageUrl = uploadResponse.secure_url;
    }

    if (pdf) {
      if (pdf.length > 5 * 1024 * 1024) {
        return res.status(400).json({ error: "PDF size exceeds 5MB limit" });
      }
      // Upload base64 PDF as stream to Cloudinary
      const stream = base64ToStream(pdf);
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "raw" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(uploadStream);
      });
      pdfUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      pdf: pdfUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(`Sending newMessage event to receiverId: ${receiverId}, socketId: ${receiverSocketId}`);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("updateUnreadCount");
    } else {
      console.log(`No socket found for receiverId: ${receiverId}`);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    if (error.http_code) {
      console.error("Cloudinary HTTP error code:", error.http_code);
    }
    if (error.message) {
      console.error("Cloudinary error message:", error.message);
    }
    res.status(500).json({ error: "Internal server error" });
  }
};
