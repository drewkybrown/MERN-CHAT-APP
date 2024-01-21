import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import io from "socket.io-client";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to get recipient's user ID

const PrivateMessagePage = ({ socket }) => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const messageRef = useRef();
  const [recipient, setRecipient] = useState(""); // Store the recipient's username
  const [userToken] = useState(localStorage.getItem("CC_Token"));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [loadedMessages, setLoadedMessages] = useState(false);

  const { recipientUserId } = useParams(); // Get recipient's user ID from the URL

  const sendPrivateMessage = () => {
    if (socket) {
      console.log("Sending private message...");
      const messageContent = messageRef.current.value.trim();
      if (messageContent && currentUser && currentUser.username) {
        socket.emit("private_message", {
          sender: currentUser.username,
          recipient: recipientUserId, // Use recipient's user ID
          content: messageContent,
        });
        messageRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (socket && !loadedMessages) {
      const fetchPrivateMessages = async () => {
        try {
          console.log("Fetching private messages...");
          const response = await axios.get(
            `http://localhost:3000/private-messages/${recipientUserId}`, // Use recipient's user ID
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );
          console.log("Private messages fetched successfully!");
          setPrivateMessages(response.data);
          setRecipient(recipientUserId); // Set recipient to recipientUserId
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
    <div>
      <h1>Private Messages with {recipient}</h1>
      <div>
        {privateMessages.map((message, i) => (
          <div key={i}>
            <span>
              {message.sender === currentUser.username
                ? "You"
                : message.sender || "Anonymous"}
              :
            </span>{" "}
            {message.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Recipient's username"
          value={recipient} // Display recipient's username
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input type="text" ref={messageRef} placeholder="Type a message..." />
        <button onClick={sendPrivateMessage}>Send</button>
      </div>
    </div>
  );
};

PrivateMessagePage.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default PrivateMessagePage;
