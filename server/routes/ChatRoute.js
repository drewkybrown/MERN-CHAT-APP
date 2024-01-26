import { Router } from "express";
import auth from "../middlewares/auth.mjs";

import {
  getAllChatrooms,
  createChatroom,
  getChatroomMessages,
  getChatroomById,
} from "../controllers/chatController.mjs";

const router = Router();

// Place specific routes above the more general ones
router.get("/:chatroomId/messages", auth, getChatroomMessages);

// Route to get a single chatroom by ID
router.get("/:chatroomId", auth, getChatroomById);

// General routes for chatrooms
router.get("/", auth, (req, res) => {
  console.log("Received GET request to /chatroom");
  getAllChatrooms(req, res);
});

router.post("/", auth, (req, res) => {
  console.log("Received POST request to /chatroom");
  createChatroom(req, res);
});

export default router;
