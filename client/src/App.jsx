import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatDashPage from "./pages/ChatDashPage";
import HomePage from "./pages/HomePage";
import PrivateMessagesPage from "./pages/PrivateMessagesPage";
import UserSearch from "./pages/UserSearch";
import io from "socket.io-client";
import ChatHeaderPage from "./pages/ChatHeaderPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    console.log("Auth Token (Client-Side):", token); // Add this line to log the token

    if (token && !socket) {
      const socketUrl =
        import.meta.env.REACT_APP_API_URL || "http://localhost:3000";
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
        console.log("Socket connected (Client-Side)"); // Add this line to log the socket connection
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);

  // Fetch the loggedInUserId from local storage
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  console.log("Logged In User ID (Client-Side):", loggedInUserId); // Add this line to log the loggedInUserId

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
        <Route
          path="/private-messages/:loggedInUserId/:selectedUserId"
          element={<PrivateMessagesPage />}
        />
        <Route
          path="/user-search"
          element={
            <UserSearch loggedInUserId={loggedInUserId} socket={socket} />
          }
          exact
        />
        <Route path="*" element={<ErrorPage />} />{" "}
        {/* Catch-all route for errors */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
