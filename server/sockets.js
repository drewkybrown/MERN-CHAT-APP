import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";
// import PrivateMessage from "./models/PrivateMessage.js"; // Import the PrivateMessage model

let userSocketMap = {}; // Maps user IDs to socket IDs

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
      userSocketMap[user._id] = socket.id; // Add user to the user-socket map
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
          "Socket Message sent in chatroom:",
          chatroomId,
          "by user:",
          socket.userId
        );
      }
    });

    // Handling private message event
    socket.on("privateMessage", async ({ recipientId, message }) => {
      if (message.trim().length > 0) {
        const newPrivateMessage = new PrivateMessage({
          sender: socket.userId,
          recipient: recipientId,
          message,
        });
        await newPrivateMessage.save();

        const recipientSocketId = userSocketMap[recipientId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("newPrivateMessage", newPrivateMessage);
        }

        // Optionally, also emit back to the sender
        socket.emit("newPrivateMessage", newPrivateMessage);
      }
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
      delete userSocketMap[socket.userId]; // Remove user from the map
    });
  });
}
