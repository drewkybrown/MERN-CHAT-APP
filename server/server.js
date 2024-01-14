const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
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

app.post("/auth/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token for the user
    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    console.error("Error in /auth/signin", err);
    res.status(500).json({ message: "Error during sign in" });
  }
});

app.post("/auth/signup", async (req, res) => {
  console.log("Signup request received:", req.body); // Log the request body

  const { username, password } = req.body;

  try {
    // Hash the user's password before saving it
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new UserModel({ username, password: hashedPassword });

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
