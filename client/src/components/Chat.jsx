import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { UserContext } from "../contexts/UserContext";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    console.log("Socket connected");

    return () => {
      newSocket.close();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (incomingMessage) => {
        console.log("Received message:", incomingMessage);
        setMessages((msgs) => [...msgs, incomingMessage]);
      });
      console.log("Message listener set up");

      return () => {
        socket.off("message");
        console.log("Message listener removed");
      };
    }
  }, [socket]);

  const sendMessage = () => {
    if (message && socket) {
      const messagePayload = {
        userId: user._id,
        text: message,
      };
      console.log({ userId: user.userId, text: message });

      socket.emit("sendMessage", messagePayload);
      console.log("Sent message:", messagePayload);
      setMessage("");
    }
  };

  const handleLogout = () => {
    console.log("Logout");
    // Implement logout functionality here
  };

  const openSettings = () => {
    console.log("Open settings");
    // Implement settings functionality here
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={openSettings}
          >
            Settings
          </button>
        </div>
        {/* Contact list goes here */}
        <ul>
          {/* Dynamically render contacts here */}
          <li className="py-2 px-4 hover:bg-gray-300 cursor-pointer">
            Contact 1
          </li>
          {/* Repeat for other contacts */}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat messages go here */}
          {messages.map((msg, index) => (
            <p key={index} className={`rounded-lg p-3 my-2 ${msg.type}`}>
              {msg.text}
            </p>
          ))}
        </div>
        <div className="p-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 hover.bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// Define prop types for Chat component
Chat.propTypes = {
  currentUserId: PropTypes.string.isRequired, // Expecting a MongoDB ObjectId string
};

export default Chat;
