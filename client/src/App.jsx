import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    console.log("Setting up socket connection...");
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      console.log("Connecting to socket server...");
      const newSocket = io("http://localhost:3000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected. Attempting to reconnect...");
        setSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
        console.log("Socket connected.");
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
        <Route path="/" element={<HomePage />} exact />{" "}
        {/* Use the Home component */}
        <Route
          path="/login"
          element={<LoginPage setupSocket={setupSocket} />}
          exact
        />
        <Route path="/register" element={<SignUpPage />} exact />
        <Route
          path="/dashboard"
          element={<ChatDashPage socket={socket} />}
          exact
        />
        <Route
          path="/chatroom/:id"
          element={<ChatHeaderPage socket={socket} />}
          exact
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
