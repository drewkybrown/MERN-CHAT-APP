import Chatroom from "../models/Chat.js";

export const getAllChatrooms = async (req, res) => {
  try {
    console.log("Received GET request to get all chatrooms."); // Added console log
    const chatrooms = await Chatroom.find({});
    res.json(chatrooms);
  } catch (error) {
    console.error("Error while getting chatrooms:", error); // Added console log
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createChatroom = async (req, res) => {
  try {
    console.log("Received POST request to create a chatroom."); // Added console log
    const { name } = req.body;
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(name)) {
      console.log("Chat name can contain only alphabets."); // Added console log
      throw "Chat name can contain only alphabets.";
    }

    const chatroomAvailable = await Chatroom.findOne({ name });

    if (chatroomAvailable) {
      console.log("Chatroom with that name already exists!"); // Added console log
      throw "Chatroom with that name already exists!";
    }

    const chatroom = new Chatroom({
      name,
    });

    await chatroom.save();

    res.json({
      message: "Chatroom created!",
    });
  } catch (error) {
    console.error("Error while creating chatroom:", error); // Added console log
    res.status(400).json({ error: error.message });
  }
};
