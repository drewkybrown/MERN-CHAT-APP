// server/server.mjs

import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";
import app from "./app.js"; // Ensure this path is correct
import privateMessageRoute from "./routes/privateMessageRoute.js"; // Ensure this path is correct
import { setupSockets } from "./sockets.js"; // Updated import statement

dotenv.config();

const port = process.env.PORT || 3000;
let serverStatus = "not running";

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error: " + err);
  process.exit(-1);
});

const server = http.createServer(app);

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

app.use("/private-message", privateMessageRoute); // Include the new private messaging route

server.listen(port, () => {
  serverStatus = "running";
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) => {
  serverStatus = "not running";
  console.error(`Server failed to start: ${error}`);
});

export default server;
