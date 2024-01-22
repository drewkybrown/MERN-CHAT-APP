import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatDashPage from "./pages/ChatDashPage";
import HomePage from "./pages/HomePage";
import PrivateMessagesPage from "./pages/PrivateMessagesPage";
import UserSearch from "./pages/UserSearch";
import io from "socket.io-client";
import ChatHeaderPage from "./pages/ChatHeaderPage";

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const socketUrl =
        typeof process !== "undefined" && process.env.REACT_APP_API_URL
          ? process.env.REACT_APP_API_URL
          : "http://localhost:3000";
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
          element={<UserSearch socket={socket} />}
          exact
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
