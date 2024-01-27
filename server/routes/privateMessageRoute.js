import express from "express";
const router = express.Router();
import { savePrivateMessage } from "../controllers/privateMessageController.mjs";

router.post("/send", async (req, res) => {
  try {
    const messageData = req.body;
    console.log("Received POST request to send private message:", messageData);

    const savedMessage = await savePrivateMessage(messageData);
    console.log("Private message saved:", savedMessage);

    res.status(200).json(savedMessage);
  } catch (error) {
    console.error("Error while sending private message:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
