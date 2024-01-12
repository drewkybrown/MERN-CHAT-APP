const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourdbname", {});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
