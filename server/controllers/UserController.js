const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await UserModel.findOne({ username: req.body.username });
    console.log("User found:", user); // Debugging log

    // Check if the user exists
    if (!user) {
      console.log("User not found"); // Debugging log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch); // Debugging log

    // If passwords don't match, return an error
    if (!isMatch) {
      console.log("Password does not match"); // Debugging log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT token with the user's ID as payload
    console.log("jwtSecret:", jwtSecret); // Debugging log
    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    console.log("JWT token:", token); // Debugging log

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    console.log("Sign in successful for user:", user.username);

    res.json({ message: "Sign in successful" });
  } catch (err) {
    console.error("Error in signIn:", err);
    res.status(500).json({ message: "Error during sign in" });
  }
};

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      console.log("Username already in use"); // Debugging log
      return res.status(409).json({ message: "Username is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const user = new UserModel({ username, password: hashedPassword });

    // Save the user to the database
    await user.save();

    // Create a JWT token with the new user's ID as payload
    console.log("jwtSecret:", jwtSecret); // Debugging log
    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    console.log("JWT token:", token); // Debugging log

    // Set the token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    console.log("Sign up successful for user:", user.username);

    res.json({ message: "Sign up successful" });
  } catch (err) {
    console.error("Error in signUp:", err);
    res.status(500).json({ message: "Error in user registration" });
  }
};

module.exports = {
  signIn,
  signUp,
};
