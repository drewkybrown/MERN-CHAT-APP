const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Corrected import
const jwtSecret = process.env.JWT_SECRET;

const signIn = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Sign in successful" });
  } catch (err) {
    res.status(500).json({ message: "Error during sign in" });
  }
};

const signUp = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const existingUser = await User.findOne({ _id: userId }); // Corrected

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ _id: userId, password: hashedPassword }); // Corrected

    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Sign up successful" });
  } catch (err) {
    res.status(500).json({ message: "Error in user registration" });
  }
};

module.exports = {
  signIn,
  signUp,
};
