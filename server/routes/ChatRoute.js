import { Router } from "express";
import auth from "../middlewares/auth.mjs";

import {
  getAllChatrooms,
  createChatroom,
} from "../controllers/ChatController.mjs"; // Use named imports

const router = Router();

router.get("/", auth, (req, res) => {
  console.log("Received GET request to /chatroom"); // Added console log
  getAllChatrooms(req, res);
});

router.post("/", auth, (req, res) => {
  console.log("Received POST request to /chatroom"); // Added console log
  createChatroom(req, res);
});

export default router;
