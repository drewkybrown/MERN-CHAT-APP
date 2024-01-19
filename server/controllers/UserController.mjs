import mongoose from "mongoose";
import User from "../models/User.js"; // Adjust the import path as needed
import bcrypt from "bcrypt";
import jwt from "jwt-then";

export const register = async (req, res) => {
  try {
    console.log("Received POST request to register a user."); // Added console log

    const { name, username, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9._-]+$/; // Regex pattern for usernames

    if (!usernameRegex.test(username)) {
      console.log("Username is not valid."); // Added console log
      throw new Error("Username is not valid."); // Change the error message
    }

    if (password.length < 6) {
      console.log("Password must be at least 6 characters long."); // Added console log
      throw new Error("Password must be at least 6 characters long.");
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log("User with the same username already exists."); // Added console log
      throw new Error("User with the same username already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password: hashedPassword });
    await user.save();

    res.json({ message: "User [" + name + "] registered successfully!" });
  } catch (error) {
    console.error("Error during user registration:", error); // Added console log
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Received POST request to login a user."); // Added console log

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      console.log("Username and Password did not match."); // Added console log
      throw new Error("Username and Password did not match.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Username and Password did not match."); // Added console log
      throw new Error("Username and Password did not match.");
    }

    const token = await jwt.sign({ id: user.id }, process.env.SECRET);
    res.json({ message: "User logged in successfully!", token });
  } catch (error) {
    console.error("Error during user login:", error); // Added console log
    res.status(400).json({ error: error.message });
  }
};
