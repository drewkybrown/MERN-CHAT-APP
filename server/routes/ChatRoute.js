import { Router } from "express";
import auth from "../middlewares/auth.mjs";

import {
  getAllChatrooms,
  createChatroom,
  getChatroomMessages,
} from "../controllers/ChatController.mjs";

const router = Router();

// Place specific routes above the more general ones
router.get("/:chatroomId/messages", auth, getChatroomMessages);

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
