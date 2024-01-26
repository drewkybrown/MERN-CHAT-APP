// import mongoose from "mongoose";

// // private message schema
// const PrivateMessageSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: "Sender is required!",
//       ref: "User",
//       index: true, // Added an index for better query performance
//     },
//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: "Receiver is required!",
//       ref: "User",
//       index: true, // Added an index for better query performance
//     },
//     message: {
//       type: String,
//       required: "Message is required!",
//     },
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt fields
//   }
// );

// export default mongoose.model("PrivateMessage", PrivateMessageSchema);
