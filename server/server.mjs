import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  //   res.send({ data: "Hello World from Socket!" });
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  //   console.log("socket connected");
  socket.on("send-message", ({ message, roomId }) => {
    let skt = socket.broadcast;
    skt = roomId ? skt.to(roomId) : skt;
    skt.emit("message-from-server", { message });
    // console.log("message-sent", data);
  });

  socket.on("typing-started", ({ roomId }) => {
    let skt = socket.broadcast;
    skt = roomId ? skt.to(roomId) : skt;
    skt.emit("typing-started-from-server");
  });

  socket.on("typing-stopped", ({ roomId }) => {
    let skt = socket.broadcast;
    skt = roomId ? skt.to(roomId) : skt;
    skt.emit("typing-stopped-from-server", { roomId });
  });

  socket.on("join-room", ({ roomId }) => {
    console.log("roomId", roomId);
    socket.join(roomId);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
