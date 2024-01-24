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

// Function to retrieve private messages between two users
export async function getPrivateMessages(req, res) {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await PrivateMessage.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort by creation time

    res.json(messages);
  } catch (error) {
    console.error("Error while retrieving private messages:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving private messages" });
  }
}

// Function to search for users
export async function searchUsers(req, res) {
  try {
    const searchTerm = req.query.username;
    const users = await User.find({
      username: new RegExp(searchTerm, "i"),
    }).select("username _id");
    res.json(users);
  } catch (error) {
    console.error("Error while searching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
