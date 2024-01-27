import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";
import app from "./app.js";
import { setupSockets } from "./sockets.js";

dotenv.config();

const port = process.env.PORT || 3001; // Use a different port

const server = http.createServer(app); // Create the HTTP server

server.listen(port, () => {
  serverStatus = "running";
  console.log(`Server is running on port ${port}`);
});

let serverStatus = "not running";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

const io = new SocketServer(server, {
  cors: {
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use setupSockets to configure your sockets
setupSockets(io);

app.use(express.static(new URL("./public", import.meta.url).pathname));

app.get("/checkStatus", (req, res) => {
  res.json({ status: serverStatus });
});

server.on("error", (error) => {
  serverStatus = "not running";
  console.error(`Server failed to start: ${error}`);
});

// Add console.log statements as needed for debugging
console.log("Server file executed."); // For checking if the server file is executed
