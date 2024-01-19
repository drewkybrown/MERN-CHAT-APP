import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatroom: {
    type: mongoose.Schema.Types.ObjectId,
    required: "Chatroom is required!",
    ref: "Chatroom",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: "User is required!", // Change the error message here
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is required!",
  },
});

export default mongoose.model("Message", MessageSchema);
