import express from "express";
import path from "path";
import privateMessageRoute from "./routes/privateMessageRoute.js";
import checkStatusRoute from "./routes/checkStatusRoute.js";
import chatroomRoute from "./routes/chatroomRoute.js";
import messagesRoute from "./routes/messagesRoute.js";

const app = express();

const publicDir = new URL("./public", import.meta.url).pathname;
app.use(express.static(publicDir));

// Use the imported route handlers
app.use("/private-message", privateMessageRoute);
app.use("/checkStatus", checkStatusRoute);
app.use("/chatroom", chatroomRoute);
app.use("/chatroom/:chatroomId/messages", messagesRoute);

export default app;
