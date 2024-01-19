import http from "http";
import express from "express";
import app from "./app.js";
import database from "./database.js";
import { setupSocketServer } from "./sockets.js"; // Import the Socket.io setup function

const port = process.env.PORT || 3000;
let serverStatus = "not running";

const server = http.createServer(app);

// Set up Socket.io using the function from sockets.js
setupSocketServer(server);

const publicDir = new URL("./public", import.meta.url).pathname;
app.use(express.static(publicDir));

app.get("/checkStatus", (req, res) => {
  res.json({ status: serverStatus });
});

server.listen(port, () => {
  serverStatus = "running";
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) => {
  serverStatus = "not running";
  console.error(`Server failed to start: ${error}`);
});
