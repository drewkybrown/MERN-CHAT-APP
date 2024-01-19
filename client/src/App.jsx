import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import io from "socket.io-client";

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
        <Route path="/" element={<ErrorPage />} exact />
        <Route
          path="/login"
          element={<LoginPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" element={<SignUpPage />} exact />
        <Route
          path="/dashboard"
          element={<DashboardPage socket={socket} />}
          exact
        />
        <Route
          path="/chatroom/:id"
          element={<ChatroomPage socket={socket} />}
          exact
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
