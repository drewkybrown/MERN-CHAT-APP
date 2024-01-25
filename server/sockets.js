import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";
import PrivateMessage from "./models/PrivateMessage.js";

export function setupSockets(io) {
  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      console.log("Received token:", token); // Log received token
      if (!token) {
        console.error("No token provided"); // Log error if no token is provided
        throw new Error("No token provided");
      }

      const payload = await jwt.verify(token, process.env.SECRET);
      const user = await User.findById(payload.id);
      if (!user) {
        console.error("User not found"); // Log error if user is not found
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

    // Private message event
    socket.on("private_message", async ({ senderId, recipientId, content }) => {
      try {
        console.log(
          "Received private message:",
          content,
          "from",
          senderId,
          "to",
          recipientId
        );

        if (!senderId || !recipientId || !content.trim().length) {
          console.error("Invalid private message data"); // Log error for invalid private message data
          throw new Error("Invalid private message data");
        }

        const newPrivateMessage = new PrivateMessage({
          sender: senderId,
          recipient: recipientId,
          content,
        });
        await newPrivateMessage.save();

        io.to(recipientId).emit("private_message", { senderId, content });
        console.log("Private message sent from", senderId, "to", recipientId);
      } catch (error) {
        console.error("Error handling private message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.userId);
    });
  });
}
