const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { UserModel } = require("./models/User");

// Loading environment variables
require("dotenv").config();

app.use(express.json()); // for parsing application/json

// Enable CORS for all routes, allowing requests from the client origin
app.use(
  cors({
    origin: "http://localhost:5173", // Client's origin
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

const jwtSecret = process.env.JWT_SECRET; // Loading the JWT secret key from the .env file

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/signup", async (req, res) => {
  console.log("Signup request received:", req.body); // Log the request body

  const { username, password } = req.body;
  const user = new UserModel({ username, password });

  try {
    await user.save();
    console.log("User saved:", user); // Log the saved user

    const payload = { userId: user._id };
    const options = { expiresIn: "1h" }; // Token expires in 1 hour
    const token = jwt.sign(payload, jwtSecret, options);
    console.log("Token generated:", token); // Log the token

    res.json({ token });
  } catch (err) {
    console.error("Error in /auth/signup", err); // More detailed error log
    res.status(500).json({ message: "Error in user registration" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
