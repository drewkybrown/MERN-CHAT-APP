import { Router } from "express";
import { register, login } from "../controllers/UserController.mjs"; // Use named imports

const router = Router();

router.post("/register", (req, res) => {
  console.log("Received POST request to /user/register"); // Added console log
  register(req, res);
});

router.post("/login", (req, res) => {
  console.log("Received POST request to /user/login"); // Added console log
  login(req, res);
});

export default router;
