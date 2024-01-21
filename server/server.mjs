import dotenv from "dotenv";
import http from "http";
import express from "express";
import app from "./app.js";
import { setupSocketServer } from "./sockets.js"; // Correct relative path

import { connectDatabase } from "./database.js"; // Correct relative path

dotenv.config();

const port = process.env.PORT || 3000;
let serverStatus = "not running";

// Connect to the database
connectDatabase();

const server = http.createServer(app);

// Call the setupSocketServer function to set up Socket.IO
setupSocketServer(server);

const publicDir = new URL("./public", import.meta.url).pathname;
app.use(express.static(publicDir));

app.get("/checkStatus", (req, res) => {
  res.json({ status: serverStatus });
});

// Other routes and server-related logic...

server.listen(port, () => {
  serverStatus = "running";
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) => {
  serverStatus = "not running";
  console.error(`Server failed to start: ${error}`);
});
