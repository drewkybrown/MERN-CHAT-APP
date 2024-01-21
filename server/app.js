import express from "express";
import path from "path";
import privateMessageRoute from "./routes/privateMessageRoute.js";

import chatroomRoute from "./routes/ChatRoute.js"; // Correct relative path with the correct case
import messagesRoute from "./routes/privateMessageRoute.js"; // Correct relative path with the correct case

const app = express();

const publicDir = new URL("./public", import.meta.url).pathname;
app.use(express.static(publicDir));

// Use the imported route handlers
app.use("/private-message", privateMessageRoute);

app.use("/chatroom", chatroomRoute);
app.use("/chatroom/:chatroomId/messages", messagesRoute);

export default app;
