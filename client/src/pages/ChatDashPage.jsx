import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const ChatDashPage = ({ socket }) => {
  const { id: chatroomId } = useParams();
  const navigate = useNavigate();

  const [chatroom, setChatroom] = useState({ name: "Loading..." });
  const [messages, setMessages] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageRef = useRef();
  const [userToken] = useState(localStorage.getItem("CC_Token"));
  const [user, setUser] = useState(null);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);

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

  const fetchMessages = async (olderThanId = "") => {
    setLoadingOlderMessages(true);
    try {
      console.log("Fetching messages for chatroom:", chatroomId);
      const response = await axios.get(
        `http://localhost:3000/chatroom/${chatroomId}/messages?olderThanId=${olderThanId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Messages fetched:", response.data);
      if (response.data.length > 0) {
        setMessages((prevMessages) => [
          ...response.data.reverse(),
          ...prevMessages,
        ]);
        // Display a notification for each new message
        response.data.forEach((message) => {
          toast.info(
            `New message from ${message.user.username}: ${message.message}`
          );
        });
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoadingOlderMessages(false);
  };

  const handleScroll = () => {
    if (
      messagesContainerRef.current.scrollTop === 0 &&
      hasMoreMessages &&
      !loadingOlderMessages
    ) {
      const oldestMessageId = messages[0]._id;
      fetchMessages(oldestMessageId);
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
        // Display a notification for each new message
        toast.info(
          `New message from ${message.user.username}: ${message.message}`
        );
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

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (!loadingOlderMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loadingOlderMessages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{chatroom.name}</h1>
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 overflow-y-auto transition duration-500 ease-in-out transform hover:scale-105"
        style={{ maxHeight: "65vh" }}
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.user.username === user?.username
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.user.username === user?.username
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                } shadow`}
              >
                <div className="font-semibold">{message.user.username}</div>
                <div>{message.message}</div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full max-w-2xl mt-6 flex flex-col items-center">
        <input
          type="text"
          ref={messageRef}
          placeholder="Type a message..."
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring focus:border-blue-400 transition duration-300"
        />
        <div className="mt-4 flex space-x-4">
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
          >
            Send
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
          >
            Leave Chat Room
          </button>
        </div>
      </div>
    </div>
  );
};

ChatDashPage.propTypes = {
  socket: PropTypes.object.isRequired,
};

export default ChatDashPage;
