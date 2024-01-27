import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

function PrivateChatPage({ socket }) {
  const { receiverUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (socket) {
      const handleNewPrivateMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        // You can implement notifications or other handling here
      };

      // Subscribe to a private chat room or conversation based on the receiver's user ID
      socket.emit("joinPrivateChat", receiverUserId);

      socket.on("new private message", handleNewPrivateMessage);

      return () => {
        // Clean up when unmounting the component
        socket.emit("leavePrivateChat", receiverUserId);
        socket.off("new private message", handleNewPrivateMessage);
      };
    }
  }, [socket, receiverUserId]);

  const sendMessage = () => {
    if (socket && messageInput.trim() !== "") {
      const senderId = socket.userId; // Use the actual sender's user ID from the socket
      const message = messageInput;

      // Emit a private message event to the server
      socket.emit("privateMessage", {
        senderId,
        receiverId: receiverUserId,
        message,
      });

      // Clear the message input field
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 p-4">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Private Chat with User {receiverUserId}
      </h2>
      <div className="chat-messages overflow-y-auto flex-grow bg-white bg-opacity-80 p-4 rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className="mb-2 text-black"
          >{`${message.senderId}: ${message.message}`}</div>
        ))}
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

PrivateChatPage.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default PrivateChatPage;
