import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const ChatDashPage = ({ socket }) => {
  const { id: chatroomId } = useParams();
  const navigate = useNavigate();

  const [chatroom, setChatroom] = useState({ name: "Loading..." });
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userToken] = useState(localStorage.getItem("CC_Token"));
  const [user, setUser] = useState(null);

  const sendMessage = () => {
    if (socket) {
      console.log("Sending message:", messageRef.current.value);
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
        console.log("Fetching chatroom details for ID:", chatroomId);
        const response = await axios.get(
          `http://localhost:3000/chatroom/${chatroomId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("Chatroom details fetched:", response.data);
        setChatroom(response.data);
      } catch (error) {
        console.error("Error fetching chatroom details:", error);
        setChatroom({ name: "Unable to load chatroom name" });
      }
    };

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for chatroom:", chatroomId);
        const response = await axios.get(
          `http://localhost:3000/chatroom/${chatroomId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log("Messages:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchChatroomDetails();
    fetchMessages();

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      console.log("User data after parsing:", userData);
    }
  }, [chatroomId, userToken]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        console.log("New message received:", message);
      };

      socket.on("newMessage", handleNewMessage);
      socket.emit("joinRoom", { chatroomId });
      console.log("Joined chatroom with ID:", chatroomId);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.emit("leaveRoom", { chatroomId });
        console.log("Left chatroom with ID:", chatroomId);
      };
    }
  }, [chatroomId, socket]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{chatroom.name}</h1>
      <div className="space-y-4">
        {messages.map((message, i) => {
          console.log(
            "Rendering message",
            i,
            "User:",
            user?.name,
            "Sender:",
            message.user.username
          );
          return (
            <div
              key={i}
              className={`flex ${
                message.user.username === user?.username
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded ${
                  message.user.username === user?.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <div className="font-semibold">{message.user.username}</div>
                <div>{message.message}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <p>Welcome, {user ? user.name : "Guest"}!</p>
        <input
          type="text"
          ref={messageRef}
          placeholder="Type a message..."
          className="border p-2 rounded mr-2 w-full"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mt-2"
        >
          Send
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-red-500 text-white px-4 py-2 rounded mt-2"
        >
          Leave Chat Room
        </button>
      </div>
    </div>
  );
};

ChatDashPage.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default ChatDashPage;
