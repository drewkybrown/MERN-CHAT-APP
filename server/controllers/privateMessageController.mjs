// import PrivateMessage from "../models/PrivateMessage.js";

// export const getPrivateMessages = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const messages = await PrivateMessage.find({
//       $or: [{ sender: userId }, { receiver: userId }],
//     }).populate("sender receiver", "username");
//     console.log("Found private messages:", messages); // Added console log
//     res.json(messages);
//   } catch (error) {
//     console.error("Error during private message search:", error); // Added console log
//     res.status(500).json({ message: error.message });
//   }
// };

// export const sendPrivateMessage = async (req, res) => {
//   try {
//     const { sender, receiver, message } = req.body;
//     console.log("Private message data:", { sender, receiver, message }); // Added console log
//     const newMessage = new PrivateMessage({ sender, receiver, message });
//     await newMessage.save();

//     const populatedMessage = await PrivateMessage.findById(
//       newMessage._id
//     ).populate("sender receiver", "username");
//     console.log("Private message sent:", populatedMessage); // Added console log
//     res.json(populatedMessage);
//   } catch (error) {
//     console.error("Error sending private message:", error); // Added console log
//     res.status(500).json({ message: error.message });
//   }
// };
