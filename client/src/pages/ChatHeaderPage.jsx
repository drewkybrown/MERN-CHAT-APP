import { Button, Card, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function ChatHeader() {
  const roomId = uuidv4();
  return (
    <div className="mt-5 p-4 bg-white shadow rounded">
      <Link to="/" className="inline-block mb-2">
        <button className="text-blue-700 hover:text-blue-900">Home</button>
      </Link>
      <Link to="/chats" className="inline-block mb-2 ml-4">
        <button className="text-blue-700 hover:text-blue-900">Chats</button>
      </Link>
      <Link
        to={`/room/${roomId}`}
        className="inline-block ml-4 text-blue-700 hover:text-blue-900"
      >
        Room1
      </Link>
    </div>
  );
}

export default ChatHeader;
