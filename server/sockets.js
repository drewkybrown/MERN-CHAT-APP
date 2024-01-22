// server/sockets.js

import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";
import Chatroom from "./models/Chat.js";
import PrivateMessage from "./models/PrivateMessage.js";

export function setupSockets(io) {
  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token; // Token sent from client during socket connection
      if (!token) {
        throw new Error("Unauthorized: No token provided");
      }
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id; // Attach the user ID to the socket object
      next();
    } catch (err) {
      console.error("Socket Authentication Error:", err);
      next(new Error("Authentication error"));
    }
  });

  // Handling connection event
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
    });

    socket.on("joinRoom", ({ chatroomId }) => {
      socket.join(chatroomId);
      console.log("A user joined chatroom:", chatroomId);
    });

    socket.on("leaveRoom", ({ chatroomId }) => {
      socket.leave(chatroomId);
      console.log("A user left chatroom:", chatroomId);
    });

    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
      if (message.trim().length > 0) {
        const user = await User.findOne({ _id: socket.userId });
        const newMessage = new Message({
          chatroom: chatroomId,
          user: socket.userId,
          message,
        });
        await newMessage.save();

        const populatedMessage = await Message.findById(
          newMessage._id
        ).populate("user", "username");
        io.to(chatroomId).emit("newMessage", populatedMessage);

        console.log(
          "Message sent by user:",
          socket.userId,
          "in chatroom:",
          chatroomId
        );
      }
    });

    socket.on("private_message", async (data) => {
      try {
        const { senderUsername, recipientUsername, content } = data;

        console.log("Received private message:", data);

        const senderUser = await User.findOne({ username: senderUsername });
        const recipientUser = await User.findOne({
          username: recipientUsername,
        });

        if (!senderUser || !recipientUser) {
          console.error("Sender or recipient not found");
          return;
        }

        const newPrivateMessage = new PrivateMessage({
          sender: senderUser._id,
          recipient: recipientUser._id,
          content,
        });

        await newPrivateMessage.save();

        io.to(senderUser._id).emit("private_message", newPrivateMessage);
        io.to(recipientUser._id).emit("private_message", newPrivateMessage);

        console.log(
          "Private message sent from",
          senderUsername,
          "to",
          recipientUsername
        );
      } catch (error) {
        console.error("Error handling private message:", error);
      }
    });
  });
}
