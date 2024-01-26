import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";

export function setupSockets(io) {
  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      if (!token) {
        throw new Error("No token provided");
      }

      const payload = await jwt.verify(token, process.env.SECRET);
      const user = await User.findById(payload.id);
      if (!user) {
        throw new Error("User not found");
      }

      socket.userId = user._id;
      next();
    } catch (err) {
      console.error("Socket Authentication Error:", err);
      next(new Error("Authentication error"));
    }
  });

  // Handling connection event
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.userId);

    // Joining a chatroom
    socket.on("joinRoom", ({ chatroomId }) => {
      console.log(`Socket ${socket.id} joining chatroom ${chatroomId}`);
      socket.join(chatroomId);
    });

    // Leaving a chatroom
    socket.on("leaveRoom", ({ chatroomId }) => {
      console.log(`Socket ${socket.id} leaving chatroom ${chatroomId}`);
      socket.leave(chatroomId);
    });

    // Chatroom message event
    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
      if (message.trim().length > 0) {
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
          "Message sent in chatroom:",
          chatroomId,
          "by user:",
          socket.userId
        );
      }
    });
  });
}
