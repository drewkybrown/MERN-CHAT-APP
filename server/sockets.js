import jwt from "jwt-then";
import User from "./models/User.js";
import Message from "./models/Message.js";
import Chat from "./models/Chat.js"; // Import the Chat model
import { savePrivateMessage } from "./controllers/privateMessageController.mjs";

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
    // console.log("Socket connected:", socket.userId);

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
    socket.on("private message", async (data) => {
      try {
        const { senderId, receiverId, message } = data;
        console.log(
          "Received private message from user:",
          senderId,
          "to user:",
          receiverId,
          "Message:",
          message
        );

        // Create a new private chatroom or retrieve an existing one
        const chatroomId = await getOrCreatePrivateChatroom(
          senderId,
          receiverId
        );

        // Save the private message
        const savedMessage = await savePrivateMessage({
          chatroomId,
          senderId,
          receiverId,
          message,
        });

        // Emit to the specific user if they are connected
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
          console.log(
            "Sending private message to user:",
            receiverId,
            "Message:",
            savedMessage
          );
          io.to(receiverSocketId).emit("new private message", savedMessage);
        } else {
          console.log("Receiver is not connected at the moment.");
        }
      } catch (error) {
        console.error("Error in private message event: ", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      // console.log("User disconnected: ", socket.userId);
      delete userSocketMap[socket.userId];
    });
  });
}

// Function to create or retrieve a private chatroom
async function getOrCreatePrivateChatroom(senderId, receiverId) {
  try {
    // Check if a chatroom already exists with both senderId and receiverId as participants
    const existingChatroom = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
      private: true, // Optionally, mark this as a private chatroom
    });

    if (existingChatroom) {
      return existingChatroom._id;
    } else {
      // Create a new private chatroom
      const newChatroom = new Chat({
        participants: [senderId, receiverId],
        private: true, // Mark this as a private chatroom
      });

      await newChatroom.save();
      return newChatroom._id;
    }
  } catch (error) {
    throw error;
  }
}
