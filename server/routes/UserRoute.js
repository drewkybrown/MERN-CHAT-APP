import { Router } from "express";
import {
  register,
  login,
  searchUsers,
} from "../controllers/userController.mjs";
import auth from "../middlewares/auth.mjs";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route for searching users
router.get("/search", auth, searchUsers);

export default router;
