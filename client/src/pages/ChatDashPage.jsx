import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
        `${apiUrl}/chatroom/${chatroomId}/messages?olderThanId=${olderThanId}`,
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
        const response = await axios.get(`${apiUrl}/chatroom/${chatroomId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
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
    <div>
      <h1>{chatroom.name}</h1>
      <div ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.map((message, i) => (
          <div key={i}>
            <div>{message.user.username}</div>
            <div>{message.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div>
        <input type="text" ref={messageRef} placeholder="Type a message..." />
        <div>
          <button onClick={sendMessage}>Send</button>
          <button onClick={() => navigate("/dashboard")}>
            Leave Chat Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDashPage;
