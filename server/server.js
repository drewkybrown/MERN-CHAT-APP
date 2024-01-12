const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { UserModel } = require("./models/User");

// Loading environment variables
require("dotenv").config();
console.log(process.env.MONGODB_URI);

app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  const user = new UserModel({ username, password });
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
}); // <-- Closing parenthesis was missing here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
