import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatDashPage from "./pages/ChatDashPage";
import HomePage from "./pages/HomePage";

import io from "socket.io-client";
import ChatHeaderPage from "./pages/ChatHeaderPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const socketUrl =
        import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000"; // Use the environment variable or localhost:3000
      const newSocket = io(socketUrl, {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
        // Socket connected
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route
          path="/login"
          element={<LoginPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" element={<SignUpPage />} exact />
        <Route
          path="/dashboard"
          element={<ChatHeaderPage socket={socket} />}
          exact
        />
        <Route
          path="/chatroom/:id"
          element={<ChatDashPage socket={socket} />}
          exact
        />
        <Route path="*" element={<ErrorPage />} />{" "}
        {/* Catch-all route for errors */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
