import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ChatHeaderPage from "./ChatHeaderPage";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

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

  const apiUrl =
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  const fetchMessages = async (olderThanId = "") => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/chatroom/${chatroomId}/messages?olderThanId=${olderThanId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.data.length > 0) {
        setMessages((prevMessages) => [
          ...response.data.reverse(),
          ...prevMessages,
        ]);
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
  };

  const handleScroll = () => {
    if (messagesContainerRef.current.scrollTop === 0 && hasMoreMessages) {
      const oldestMessageId = messages[0]._id;
      fetchMessages(oldestMessageId);
    }
  };

  useEffect(() => {
    const fetchChatroomDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/chatroom/${chatroomId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
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
    }
  }, [chatroomId, userToken, apiUrl]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        toast.info(
          `New message from ${message.user.username}: ${message.message}`
        );
      };

      socket.on("newMessage", handleNewMessage);
      socket.emit("joinRoom", { chatroomId });

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.emit("leaveRoom", { chatroomId });
      };
    }
  }, [chatroomId, socket]);

  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 h-screen text-black p-4 flex">
      <div className="w-1/3 pr-4">
        <ChatHeaderPage />
      </div>
      <div className="w-2/3 pl-4">
        <h1 className="text-2xl font-semibold mb-4">{chatroom.name}</h1>
        <div
          className="overflow-y-auto max-h-96 p-2 bg-gray-900 bg-opacity-80 rounded-lg"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((message, i) => (
            <div
              key={i}
              className={`mb-2 ${
                message.user._id === user._id ? "text-right" : "text-left"
              }`}
            >
              {message.user._id !== user._id && (
                <div className="text-red-700 font-bold">
                  {message.user.username}
                </div>
              )}
              <div
                className={`${
                  message.user._id === user._id
                    ? "bg-blue-500 text-red rounded-lg p-2 inline-block"
                    : "bg-red-300 text-black rounded-lg p-2 inline-block"
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-4">
          <input
            type="text"
            ref={messageRef}
            placeholder="Type a message..."
            className="w-full px-3 py-2 border border-red-600 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-red rounded hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
            >
              Send
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="ml-2 px-4 py-2 bg-red-500 text-red rounded hover:bg-red-600 focus:outline-none focus:ring focus:bg-red-600"
            >
              Leave Chat Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Define prop types for ChatDashPage
ChatDashPage.propTypes = {
  socket: PropTypes.object.isRequired, // Adjust the prop type as needed
};

export default ChatDashPage;
