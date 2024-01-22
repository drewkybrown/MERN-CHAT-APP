import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom";

const PrivateMessagePage = ({ socket }) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const messageRef = useRef();
  const [recipient, setRecipient] = useState("");
  const [userToken] = useState(localStorage.getItem("CC_Token"));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [loadedMessages, setLoadedMessages] = useState(false);

  const { recipientUserId } = useParams();

  const sendPrivateMessage = () => {
    if (socket) {
      console.log("Sending private message...");
      const messageContent = messageRef.current.value.trim();
      if (messageContent && currentUser && currentUser.username) {
        socket.emit("private_message", {
          sender: currentUser.username,
          recipient: recipientUserId,
          content: messageContent,
        });
        messageRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (socket && !loadedMessages) {
      const apiUrl =
        typeof process !== "undefined" && process.env.REACT_APP_API_URL
          ? process.env.REACT_APP_API_URL
          : "http://localhost:3000";

      const fetchPrivateMessages = async () => {
        try {
          console.log("Fetching private messages...");
          const response = await axios.get(
            `${apiUrl}/private-messages/${recipientUserId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          console.log("Private messages fetched successfully!");
          setPrivateMessages(response.data);
          setRecipient(recipientUserId);
          setLoadedMessages(true);
        } catch (error) {
          console.error("Error fetching private messages:", error);
        }
      };

      fetchPrivateMessages();
    }
  }, [recipientUserId, userToken, currentUser, loadedMessages, socket]);

  useEffect(() => {
    if (socket) {
      const handleNewPrivateMessage = (message) => {
        setPrivateMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on("private_message", handleNewPrivateMessage);

      return () => {
        socket.off("private_message", handleNewPrivateMessage);
      };
    }
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-pink-100 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">
        Private Messages with {recipient}
      </h1>
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow p-6 mb-6 overflow-y-auto"
        style={{ maxHeight: "60vh" }}
      >
        <div className="space-y-4">
          {privateMessages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.sender === currentUser.username
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <span className="font-semibold mr-2">
                {message.sender === currentUser.username
                  ? "You"
                  : message.sender || "Anonymous"}
                :
              </span>
              <span
                className={`${
                  message.sender === currentUser.username
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-2xl flex items-center">
        <input
          type="text"
          placeholder="Recipient's username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-1/3 mr-2 focus:outline-none focus:ring focus:border-blue-400"
        />
        <input
          type="text"
          ref={messageRef}
          placeholder="Type a message..."
          className="border border-gray-300 p-2 rounded-lg w-1/3 mr-2 focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={sendPrivateMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

PrivateMessagePage.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default PrivateMessagePage;
