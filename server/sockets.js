import { Server as SocketServer } from "socket.io";
import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";

// Create a function to set up Socket.io
export function setupSocketServer(server) {
  const io = new SocketServer(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      if (!token) {
        throw new Error("Token not provided.");
      }

      const payload = await jwt.verify(token, process.env.SECRET);
      if (!payload.id) {
        throw new Error("Invalid payload.");
      }

      socket.userId = payload.id;
      console.log("Socket Authenticated: " + socket.userId);
      next();
    } catch (err) {
      console.error("Socket Authentication Error:", err.message);
      socket.disconnect(); // Disconnect the socket on authentication error
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
    });

    socket.on("joinRoom", ({ chatroomId }) => {
      socket.join(chatroomId);
      console.log("A user joined chatroom: " + chatroomId);
    });

    socket.on("leaveRoom", ({ chatroomId }) => {
      socket.leave(chatroomId);
      console.log("A user left chatroom: " + chatroomId);
    });

    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
      if (!socket.userId) {
        console.error("User not authenticated.");
        return;
      }

      if (message.trim().length > 0) {
        try {
          const user = await User.findOne({ _id: socket.userId });
          if (!user) {
            throw new Error("User not found.");
          }

          const newMessage = new Message({
            chatroom: chatroomId,
            user: socket.userId,
            message,
          });
          io.to(chatroomId).emit("newMessage", {
            message,
            name: user.name,
            userId: socket.userId,
          });
          await newMessage.save();
          console.log(
            "Message sent by user:",
            socket.userId,
            "in chatroom:",
            chatroomId
          );
        } catch (error) {
          console.error("Error sending chatroom message:", error.message);
        }
      }
    });
  });
}
