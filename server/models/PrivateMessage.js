// models/PrivateMessage.js

import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model for the sender
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the User model for the recipient
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PrivateMessage = mongoose.model("PrivateMessage", privateMessageSchema);

// Added console logs
console.log("PrivateMessage model initialized");

export default PrivateMessage;
