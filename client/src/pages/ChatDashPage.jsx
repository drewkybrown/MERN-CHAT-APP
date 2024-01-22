import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import PropTypes from "prop-types";
import axios from "axios";

const ChatDashPage = ({ socket }) => {
  const { id: chatroomId } = useParams();
  const navigate = useNavigate(); // Create a navigate function

  const [chatroom, setChatroom] = useState({ name: "Loading..." });
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userToken] = useState(localStorage.getItem("CC_Token"));
  const [user, setUser] = useState(null); // Initialize user state

  const sendMessage = () => {
    if (socket) {
      console.log("Sending message...");
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    const fetchChatroomDetails = async () => {
      try {
        console.log("Fetching chatroom details...");
        const response = await axios.get(
          `http://localhost:3000/chatroom/${chatroomId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("Chatroom details fetched successfully!");
        setChatroom(response.data);
      } catch (error) {
        console.error("Error fetching chatroom details:", error);
        setChatroom({ name: "Unable to load chatroom name" });
      }
    };

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages...");
        const response = await axios.get(
          `http://localhost:3000/chatroom/${chatroomId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("Messages fetched successfully!");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChatroomDetails();
    fetchMessages();

    // Retrieve user info from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, [chatroomId, userToken]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      socket.on("newMessage", handleNewMessage);

      socket.emit("joinRoom", { chatroomId });

      console.log("Joined chatroom:", chatroomId);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.emit("leaveRoom", { chatroomId });

        console.log("Left chatroom:", chatroomId);
      };
    }
  }, [chatroomId, socket]);

  return (
    <div>
      <h1>{chatroom.name}</h1>
      <div>
        {messages.map((message, i) => (
          <div key={i}>
            <span>{message.user.username || "Anonymous"}:</span>{" "}
            {message.message}
          </div>
        ))}
      </div>
      <div>
        <p>Welcome, {user ? user.name : "Guest"}!</p>{" "}
        {/* Display user's name */}
        <input type="text" ref={messageRef} placeholder="Type a message..." />
        <button onClick={sendMessage}>Send</button>
        {/* Add a button to navigate back to localhost:3000/dashboard */}
        <button onClick={() => navigate("/dashboard")}>Leave Chat Room</button>
      </div>
    </div>
  );
};

ChatDashPage.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default ChatDashPage;
