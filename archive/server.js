const express = require("express"); // Change 'from' to '='
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const chatRouter = require("./routes/chatRoutes");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

dotenv.config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React app's URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/chat", chatRouter); // Use the chatRouter for chat-related routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection established successfully");
});

// Start Express server
server.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

// Socket.IO Setup
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on("sendMessage", (message) => {
    io.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

console.log(`Socket.IO server is running on port ${port}`);
