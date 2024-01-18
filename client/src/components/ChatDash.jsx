import React from "react";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";

function ChatDash() {
  const { socket } = useOutletContext();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const { roomId } = useParams();

  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: true }]);
    });
    // socket.on("message-from-server", (data) => {
    // console.log("Message received", data);
    socket.on("typing-from-server", () => {
      setTyping(true);
      console.log("Someone is typing");
    });

    socket.on("typing-stopped-from-server", () => {
      setTyping(false);
      console.log("Someone stopped typing");
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message, roomId });
    setChat((prev) => [...prev, { message, received: false }]);
    console.log(message);
    setMessage("");
  }

  const [typingTimeout, settypingTimeout] = useState(null);

  function handleInput(e) {
    setMessage(e.target.value);
    socket.emit("typing-started-from-server", { roomId });
    if (typingTimeout) clearTimeout(typingTimeout);
    settypingTimeout(
      setTimeout(() => {
        //   socket.emit("typing-stopped-from-server");
        socket.emit("typing-stopped-from-server", { roomId });
        console.log("stopped typing");
      }, 1000)
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Card sx={{ padding: 2, marginTop: 10, width: "60%" }}>
        <div>
          <div className="text-3xl font-bold underline"></div>

          {roomId && <Typography>Room: {roomId}</Typography>}
          <Box sx={{ marginBottom: 5 }}>
            {chat.map((data) => (
              <Typography
                sx={{ textAlign: data.received ? "left" : "right" }}
                key={data.message}
              >
                {data.message}
              </Typography>
            ))}
          </Box>
          <Box component="form" onSubmit={handleForm}>
            {typing && (
              <InputLabel
                sx={{ color: "black" }}
                shrink
                htmlFor="message-input"
              >
                Typing
              </InputLabel>
            )}
            <TextField
              id="message-input"
              label="Write your message here"
              variant="standard"
              value={message} // Ensure `message` is defined in your component
              onChange={handleInput}
            />
            <Button variant="text" type="submit">
              Send
            </Button>
          </Box>
        </div>
      </Card>
    </Box>
  );
}

export default ChatDash;
