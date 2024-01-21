import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Chatroom is required!",
      ref: "Chatroom",
      index: true, // Added an index for better query performance
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User is required!",
      ref: "User",
      index: true, // Added an index for better query performance
    },
    message: {
      type: String,
      required: "Message is required!",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.model("Message", MessageSchema);
