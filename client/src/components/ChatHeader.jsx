import { Button, Card, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function ChatHeader() {
  const roomId = uuidv4();
  return (
    <Card sx={{ marginTop: 5 }}>
      <Link to="/">
        <Button variant="text">Home</Button>
      </Link>
      <Link to="/chats">
        <Button variant="text">Chats</Button>
      </Link>
      <Link to={`/room/${roomId}`}>Room1</Link>
    </Card>
  );
}

export default ChatHeader;
