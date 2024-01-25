import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const PrivateMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { loggedInUserId, selectedUserId } = useParams();
  const socket = io(
    import.meta.env.REACT_APP_API_URL || "http://localhost:3000"
  );

  console.log("Component Rendered - PrivateMessagesPage");

  useEffect(() => {
    console.log("useEffect called");

    const fetchMessages = async () => {
      console.log("fetchMessages function called");
      try {
        // Get the authentication token from localStorage
        const authToken = localStorage.getItem("CC_Token");
        console.log("Auth Token:", authToken); // Log the authentication token

        const response = await axios.get(
          `${
            import.meta.env.REACT_APP_API_URL
          }/private-message/conversation/${loggedInUserId}/${selectedUserId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        console.log("Fetch Messages Response:", response.data); // Log the fetch messages response

        // Check if response.data is an array before setting it in the state
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          console.error(
            "Fetch Messages Response is not an array:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        console.error("Error details:", error.response);
      }
    };

    fetchMessages();

    socket.on("private_message", (message) => {
      console.log("Received Private Message:", message); // Log received private message

      // Check if messages is an array before updating the state
      if (Array.isArray(messages)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        console.error("Messages is not an array:", messages);
      }
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("private_message");
    };
  }, [selectedUserId, socket, loggedInUserId]);

  const sendMessage = () => {
    console.log("sendMessage function called");
    const messageData = {
      senderId: loggedInUserId,
      recipientId: selectedUserId,
      content: newMessage,
    };

    console.log("Sending Private Message:", messageData); // Log sending private message
    socket.emit("private_message", messageData);
    setNewMessage("");
  };

  console.log("Current Messages State:", messages);

  return (
    <div>
      {Array.isArray(messages) ? (
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              {msg.sender === loggedInUserId ? "You" : "Them"}: {msg.content}
            </li>
          ))}
        </ul>
      ) : (
        <div>Messages is not an array</div>
      )}
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
