const mongoose = require("mongoose"); // Import mongoose

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model("Chat", chatSchema);

console.log("ChatModel.js: ChatModel created"); // Log that the ChatModel is created

export default ChatModel; // Exporting the ChatModel directly
