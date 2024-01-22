import PrivateMessage from "../models/PrivateMessage.js"; // Make sure the path to your model is correct
import User from "../models/User.js"; // Import the User model

// Function to send a private message
export async function sendPrivateMessage(req, res) {
  try {
    console.log("Received POST request to send a private message.");
    const { sender, recipient, content } = req.body;

    // Validate input and handle exceptions as needed
    if (!sender || !recipient || !content) {
      console.error("Invalid input data"); // Added console log
      return res.status(400).json({ error: "Invalid input data" });
    }

    // Check if sender and recipient exist in your User model
    const senderExists = await User.exists({ _id: sender });
    const recipientExists = await User.exists({ _id: recipient });

    if (!senderExists || !recipientExists) {
      console.error("Sender or recipient not found"); // Added console log
      return res.status(400).json({ error: "Sender or recipient not found" });
    }

    const newPrivateMessage = new PrivateMessage({
      sender,
      recipient,
      content,
    });

    await newPrivateMessage.save();

    // Emit a Socket.io event to notify the recipient of the new message
    const io = req.app.get("socketio"); // Retrieve Socket.io instance from app.js
    io.to(recipient).emit("private_message", newPrivateMessage);

    console.log("Private message sent successfully"); // Added console log
    res.status(201).json({ message: "Private message sent successfully" });
  } catch (error) {
    console.error("Error while sending the private message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the private message" });
  }
}

// Function to retrieve private messages for a user
export async function getPrivateMessages(req, res) {
  try {
    const userId = req.params.userId;
    console.log(
      "Received GET request to get private messages for user:",
      userId
    );

    // Retrieve and send private messages for the user
    const messages = await PrivateMessage.find({ recipient: userId });

    console.log("Private messages retrieved successfully"); // Added console log
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error while retrieving private messages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving private messages" });
  }
}
