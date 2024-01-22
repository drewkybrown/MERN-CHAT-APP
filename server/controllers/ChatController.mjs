import Message from "../models/Message.js";
import Chat from "../models/Chat.js"; // Import the Chat model

export const getAllChatrooms = async (req, res) => {
  try {
    console.log("Received GET request to get all chatrooms.");
    const chatrooms = await Chat.find({}); // Use the Chat model instead of Chatroom
    res.json(chatrooms);
  } catch (error) {
    console.error("Error while getting chatrooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createChatroom = async (req, res) => {
  try {
    console.log("Received POST request to create a chatroom.");
    const { name } = req.body;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) {
      console.log("Chat name can contain only alphabets.");
      throw "Chat name can contain only alphabets.";
    }

    const chatroomAvailable = await Chat.findOne({ name }); // Use the Chat model instead of Chatroom

    if (chatroomAvailable) {
      console.log("Chatroom with that name already exists!");
      throw "Chatroom with that name already exists!";
    }

    const chatroom = new Chat({
      name, // Use the Chat model instead of Chatroom
    });

    await chatroom.save();

    res.json({
      message: "Chatroom created!",
    });
  } catch (error) {
    console.error("Error while creating chatroom:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getChatroomMessages = async (req, res) => {
  try {
    const chatroomId = req.params.chatroomId;
    console.log(
      "Received GET request to get chatroom messages for:",
      chatroomId
    );
    const messages = await Message.find({ chatroom: chatroomId }).populate(
      "user",
      "username"
    );

    res.json(messages);
  } catch (error) {
    console.error("Error while getting chatroom messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
