import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const dbConnection = mongoose.connection;

dbConnection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

dbConnection.on("open", () => {
  console.log("Connected to MongoDB");
});

dbConnection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

export default dbConnection;
