const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model("Message", messageSchema);

console.log("MessageModel.js: MessageModel created"); // Log that the MessageModel is created

module.exports = MessageModel; // Exporting the MessageModel directly
