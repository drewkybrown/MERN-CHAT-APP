import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import privateRoute from "./routes/privateMessageRoute.js";
import cors from "cors"; // Ensure CORS is imported if not already
import express from "express"; // Ensure express is imported

const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use(cors());

// Routes
app.use("/api/user", userRoute); // User-related routes
app.use("/api/chatroom", chatRoute); // Chatroom-related routes
app.use("/api/private", privateRoute); // Private message-related routes, corrected the missing '/'

// Console log to track app initialization
console.log("Express app initialized.");

export default app;
