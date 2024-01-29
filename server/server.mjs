import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

import http from "http";
import express from "express";
import { Server as SocketServer } from "socket.io";
import app from "./app.js";
import { setupSockets } from "./sockets.js";
import database from "./config/database.js"; // Import the 'mongoose' instance

const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

let serverStatus = "not running";

const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use setupSockets to configure your sockets
setupSockets(io);

app.use(express.static(new URL("./public", import.meta.url).pathname));

app.get("/checkStatus", (req, res) => {
  // You can perform a simple database operation here
  // For example, querying a collection in MongoDB
  database
    .collection("yourCollectionName") // Replace with your actual collection name
    .findOne(
      {
        /* Your query here */
      },
      (error, result) => {
        if (error) {
          console.error("Error querying the database:", error);
          res.status(500).json({ status: "error" });
        } else {
          serverStatus = "running";
          res.json({ status: serverStatus, databaseResult: result });
        }
      }
    );
});

server.on("error", (error) => {
  serverStatus = "not running";
  console.error(`Server failed to start: ${error}`);
});

console.log("Server file executed.");
