import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import privateMessageRoute from "./routes/privateMessageRoute.js";

const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use(cors());

// Routes
app.use("/user", userRoute); // User-related routes
app.use("/chatroom", chatRoute); // Chatroom-related routes
app.use("/private-message", privateMessageRoute); // Private messaging routes

// Console log to track app initialization
console.log("Express app initialized.");

export default app;
