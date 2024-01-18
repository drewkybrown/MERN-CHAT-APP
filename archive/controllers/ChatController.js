// Empty for now
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

const getChats = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("Error getting chats");
    return res.status(400).send({ message: "Invalid credentials" });
  }

  try {
    const chats = await Chat.find({ userId: userId });
    res.send({ chats });
  } catch (error) {
    return res.status(422).send(error.message);
  }
};

module.exports = {
  getChats,
};
