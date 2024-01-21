import { Router } from "express";
import { register, login } from "../controllers/UserController.mjs"; // Use named imports
import { searchUsers } from "../controllers/UserController.mjs"; // Import the new searchUsers function

const router = Router();

router.get("/search", (req, res) => {
  console.log("Received GET request to /user/search"); // Added console log
  searchUsers(req, res);
});

router.post("/register", (req, res) => {
  console.log("Received POST request to /user/register"); // Added console log
  register(req, res);
});

router.post("/login", (req, res) => {
  console.log("Received POST request to /user/login"); // Added console log
  login(req, res);
});

export default router;
