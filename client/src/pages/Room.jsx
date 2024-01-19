import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ChatDash from "./ChatDash";
import { Typography } from "@mui/material";

function Room() {
  const params = useParams();
  const { socket } = useOutletContext();
  useEffect(() => {
    if (!socket) return;
    socket.emit("join-room", { roomId: params.roomId });
    console.log(params);
  }, [socket]);

  return <ChatDash />;
}

export default Room;
