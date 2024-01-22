import mongoose from "mongoose";
import User from "../models/User.js"; // Adjust the import path as needed
import bcrypt from "bcryptjs";

import jwt from "jwt-then";

// UserController.js

export const searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    console.log("Received GET request to search users with term:", searchTerm); // Added console log
    // Use a regex for case-insensitive partial matches
    const users = await User.find({
      $or: [
        { name: new RegExp(searchTerm, "i") },
        { username: new RegExp(searchTerm, "i") },
      ],
    }).select("-password"); // Exclude password field from results
    console.log("Found users matching the search term:", users); // Added console log
    res.json(users);
  } catch (error) {
    console.error("Error during user search:", error); // Added console log
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    console.log("Received POST request to register a user.");

    const { name, username, password } = req.body;
    console.log("User registration data:", { name, username, password }); // Added console log
    const usernameRegex = /^[a-zA-Z0-9._-]+$/; // Regex pattern for usernames

    if (!usernameRegex.test(username)) {
      console.log("Username is not valid.");
      throw new Error("Username is not valid.");
    }

    if (password.length < 6) {
      console.log("Password must be at least 6 characters long.");
      throw new Error("Password must be at least 6 characters long.");
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log("User with the same username already exists.");
      throw new Error("User with the same username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password: hashedPassword });
    await user.save();

    console.log("User registered successfully:", user); // Added console log
    res.json({ message: "User [" + name + "] registered successfully!" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Received POST request to login a user.");

    const { username, password } = req.body;
    console.log("User login data:", { username, password }); // Added console log
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Username and Password did not match.");
      throw new Error("Username and Password did not match.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Username and Password did not match.");
      throw new Error("Username and Password did not match.");
    }

    const token = await jwt.sign({ id: user.id }, process.env.SECRET);

    // Send back the token and user data
    console.log("User logged in successfully:", user); // Added console log
    res.json({
      message: "User logged in successfully!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        // Include other user data fields as needed
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(400).json({ error: error.message });
  }
};
