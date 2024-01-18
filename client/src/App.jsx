import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, createBrowserRouter, Route } from "react-router-dom";
import ChatHeader from "./components/ChatHeader";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io("http://localhost:3000"));
  }, []);
  return (
    <Container>
      <ChatHeader />
      <Outlet context={{ socket }} /> {/* This will render child routes */}
    </Container>
  );
}

export default App;
