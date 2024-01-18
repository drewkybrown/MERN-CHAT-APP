const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

mongoose
  .connect(MONGODB_URI, {})
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("Connection error", err));

module.exports = mongoose.connection;
