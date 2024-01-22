// app.js

import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import privateMessageRoute from "./routes/privateMessageRoute.js"; // Import the new private messaging route
import { Server as SocketServer } from "socket.io";
// ...other imports

const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use(cors());

// Routes
app.use("/user", userRoute);
app.use("/chatroom", chatRoute);

// Include the new private messaging route
app.use("/private-message", privateMessageRoute); // Adjust the route path accordingly

// Console logs to track different actions
console.log("Express app initialized."); // Added console log

export default app;
