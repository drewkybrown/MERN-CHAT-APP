// server/database.js

import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});
