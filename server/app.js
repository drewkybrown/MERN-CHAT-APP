import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

const app = express();

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware for cross-origin requests
app.use(cors());

// Routes
app.use("/user", userRoute);
app.use("/chatroom", chatRoute);

// Console logs to track different actions
console.log("Express app initialized."); // Added console log

export default app;
