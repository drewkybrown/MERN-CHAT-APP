const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser"); // Import cookie-parser for handling cookies
const { UserModel } = require("./models/User"); // Import the UserModel from your models directory
const WebSocket = require("ws");

// Loading environment variables
require("dotenv").config();

app.use(express.json()); // for parsing application/json
app.use(
  cors({
    origin: "http://localhost:5173", // Client's origin
    credentials: true,
  })
);
app.use(cookieParser()); // Use cookie-parser middleware to handle cookies

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

const jwtSecret = process.env.JWT_SECRET;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/auth/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    console.log("Cookie set:", token); // Log the token

    res.json({ message: "Sign in successful" });
  } catch (err) {
    console.error("Error in /auth/signin", err);
    res.status(500).json({ message: "Error during sign in" });
  }
});

app.post("/auth/signup", async (req, res) => {
  console.log("Signup request received:", req.body);

  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, password: hashedPassword });

    await user.save();
    console.log("User saved:", user);

    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    console.log("Cookie set:", token); // Log the token

    res.json({ message: "Sign up successful" });
  } catch (err) {
    console.error("Error in /auth/signup", err);
    res.status(500).json({ message: "Error in user registration" });
  }
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("Received message:", message);
    ws.send("Hello from server!");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
