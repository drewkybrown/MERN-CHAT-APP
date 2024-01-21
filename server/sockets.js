// server/sockets.js

import { Server as SocketServer } from "socket.io";
import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";
import PrivateMessage from "./models/PrivateMessage.js";

export function setupSocketServer(httpServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*", // Allow requests from any origin
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const payload = await jwt.verify(token, process.env.SECRET);
      socket.userId = payload.id;
      console.log("Socket Authenticated: " + socket.userId);
      next();
    } catch (err) {
      console.error("Socket Authentication Error:", err);
    }
  });

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

    // Add other socket event handlers here...

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
