import PrivateMessage from "../models/PrivateMessage.js";

const savePrivateMessage = async (data) => {
  try {
    const { senderId, receiverId, message } = data;
    console.log("Saving private message:", data);

    const newMessage = new PrivateMessage({ senderId, receiverId, message });
    await newMessage.save();
    console.log("Private message saved:", newMessage);

    return newMessage;
  } catch (error) {
    console.error("Error saving private message:", error);
    throw error;
  }
};

export default savePrivateMessage;
