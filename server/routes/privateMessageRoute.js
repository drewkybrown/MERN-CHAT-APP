// routes/privateMessageRoute.js
import express from "express";
import {
  sendPrivateMessage,
  getPrivateMessages,
  searchUsers,
} from "../controllers/PrivateMessageController.mjs";
import auth from "../middlewares/auth.mjs"; // Import your auth middleware

const router = express.Router();

// Route to send a private message
router.post("/send", auth, sendPrivateMessage);

// Route to get private messages between two specific users
router.get("/conversation/:userId/:otherUserId", auth, getPrivateMessages);

// Route for user search
router.get("/search-users", auth, searchUsers);

export default router;
