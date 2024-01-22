import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatDashPage from "./pages/ChatDashPage";
import HomePage from "./pages/HomePage";

import PrivateMessagesPage from "./pages/PrivateMessagesPage"; // Import your PrivateMessagesPage component
import UserSearch from "./pages/UserSearch";
import io from "socket.io-client";
import ChatHeaderPage from "./pages/ChatHeaderPage";

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    console.log("Setting up socket connection..."); // Added console log
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      console.log("Connecting to socket server..."); // Added console log
      const newSocket = io("http://localhost:3000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected. Attempting to reconnect..."); // Added console log
        setSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
        console.log("Socket connected."); // Added console log
        // Additional logic can be added here if needed
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
    // eslint-disable-next-line
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
        <Route
          path="/private-messages/:userId"
          element={<PrivateMessagesPage socket={socket} />}
        />

        <Route
          path="/user-search"
          element={<UserSearch socket={socket} />} // Add the UserSearch component
          exact
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
