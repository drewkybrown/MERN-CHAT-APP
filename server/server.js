const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes"); // Importing user routes
const MessageModel = require("./models/Message"); // Importing Message model
const UserModel = require("./models/User"); // Importing User model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const chatRoutes = require("./routes/chatRoutes"); // Importing chat routes
// const accessToken = jwt.sign(user, process.env.JWT_SECRET);
// const user = { _id: userFromDb._id, username: userFromDb.username };
require("dotenv").config();
const app = express();

// Console logs for debugging
console.log("Starting server...");
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("NODE_ENV:", process.env.NODE_ENV);

// CORS middleware setup for Express
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your client app's URL
    credentials: true,
  })
);
console.log("CORS middleware configured.");

app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

// Use Routes
app.use(userRoutes);
app.use(chatRoutes);

// HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Update with your client app's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});
console.log("Socket.IO and WebSocket setup complete.");

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`New WebSocket connection: ${socket.id}`);

  // Handling sendMessage event
  socket.on("sendMessage", (messageData) => {
    console.log(`Received message from ${socket.id}:`, messageData);

    // Validate messageData
    if (!messageData || !messageData.userId || !messageData.text) {
      console.error("Missing userId or text in the received message");
      return; // Exit if data is incomplete
    }

    // Create a new message document
    const newMessage = new MessageModel({
      userId: messageData.userId,
      text: messageData.text,
    });

    // Save the message to MongoDB
    newMessage
      .save()
      .then((savedMessage) => {
        console.log("Message saved to MongoDB:", savedMessage);
      })
      .catch((err) => {
        console.error("Error saving message:", err);
      });

    io.emit("message", messageData); // Broadcasting the message
  });

  socket.on("disconnect", () => {
    console.log(`WebSocket disconnected: ${socket.id}`);
  });
});

// Server listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
