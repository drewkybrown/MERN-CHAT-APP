import { Router } from "express";
import {
  register,
  login,
  searchUsers,
} from "../controllers/userController.mjs";
import auth from "../middlewares/auth.mjs"; // Import the middleware and name it auth for clarity

const router = Router();

// Protected route for searching users
router.get("/search", auth, searchUsers);

// Public routes for registration and login
router.post("/register", register);
router.post("/login", login);

export default router;
