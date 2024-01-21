// routes/privateMessageRoute.js

import express from "express";
import { sendPrivateMessage } from "../controllers/PrivateMessageController.mjs";

const router = express.Router();

// Route to send a private message
router.post("/send", (req, res) => {
  console.log("Received POST request to /private-messages/send");
  sendPrivateMessage(req, res);
});

export default router;
