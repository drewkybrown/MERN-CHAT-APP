const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const Message = require("../models/Message"); // Import your Message model
const jwtSecret = process.env.JWT_SECRET;

const ChatController = {
  sendMessage: async (req, res) => {
    try {
      const { message } = req.body;
      const io = req.app.get("io"); // Get the Socket.IO instance from req.app
      const { text } = req.query;

      // Assuming you have a User model with user information
      const user = req.user;
      console.log("User sending message:", user); // Debugging log
      console.log("Message content:", message); // Debugging log

      // Emit the message to all connected clients (WebSocket)
      io.emit("message", { text: message, type: "received" });
      console.log("Message emitted:", message); // Debugging log

      // Create a new Message document and save it to the database
      const newMessage = new Message({
        userId: user._id,
        text: message,
      });

      // Save the message to MongoDB
      const savedMessage = await newMessage.save();
      console.log("Saved message:", savedMessage); // Debugging log

      res.status(200).json({
        success: true,
        message: "Message sent and saved successfully",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },

  getMessages: async (req, res) => {
    try {
      const user = req.user;
      const { userId } = req.params;
      const { text } = req.query;

      // Fetch messages between the authenticated user (user) and the specified user (userId)
      const messages = await Message.find({
        $or: [
          { userId: user._id, receiverId: userId },
          { userId: userId, receiverId: user._id },
        ],
      })
        .limit(100)
        .sort({ createdAt: -1 });

      console.log("Fetched messages:", messages); // Debugging log

      res.status(200).json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  },
};

module.exports = ChatController;
