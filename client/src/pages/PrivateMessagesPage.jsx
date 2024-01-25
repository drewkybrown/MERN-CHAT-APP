import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const PrivateMessagesPage = ({ loggedInUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId } = useParams();
  const socket = io(
    import.meta.env.REACT_APP_API_URL || "http://localhost:3000"
  ); // Use the environment variable or localhost:3000

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Get the authentication token from localStorage
        const authToken = localStorage.getItem("CC_Token");

        console.log("Auth Token:", authToken); // Log the authentication token

        const response = await axios.get(
          `${
            import.meta.env.REACT_APP_API_URL
          }/private-message/conversation/${loggedInUserId}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include the token in the headers
            },
          }
        );

        console.log("Fetch Messages Response:", response.data); // Log the fetch messages response

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("private_message", (message) => {
      console.log("Received Private Message:", message); // Log received private messages
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("private_message");
    };
  }, [userId, socket, loggedInUserId]);

  const sendMessage = () => {
    const messageData = {
      senderId: loggedInUserId, // Use the logged-in user's ID
      recipientId: userId,
      content: newMessage,
    };

    socket.emit("private_message", messageData);
    console.log("Sent Private Message:", messageData); // Log sent private messages
    setNewMessage("");
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.sender === loggedInUserId ? "You" : "Them"}: {msg.content}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default PrivateMessagesPage;
