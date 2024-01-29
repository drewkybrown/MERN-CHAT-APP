import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
console.log("MONGODB_URI", process.env.MONGODB_URI);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

export default mongoose;
