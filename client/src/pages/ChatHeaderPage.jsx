import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ChatHeaderPage = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const navigate = useNavigate();
  const chatroomNameRef = React.createRef();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user info from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  const apiUrl =
    import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("CC_Token");
    localStorage.removeItem("loggedIn");

    // Redirect to the login page
    navigate("/login");
  };

  const getChatrooms = () => {
    axios
      .get(`${apiUrl}/api/chatroom`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  useEffect(() => {
    getChatrooms();
  }, []);

  const createChatroom = () => {
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post(
        `${apiUrl}/api/chatroom`,
        { name: chatroomName },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        getChatrooms();
        chatroomNameRef.current.value = "";
      })
      .catch((err) => {
        console.error("Error creating chatroom:", err);
      });
  };

  // Function to count unread messages for a chatroom
  const countUnreadMessages = (chatroomId) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (
      userData &&
      userData.lastReadMessages &&
      userData.lastReadMessages[chatroomId]
    ) {
      const lastReadTimestamp = userData.lastReadMessages[chatroomId];
      // Compare last read timestamp with message timestamps and count unread messages
      // Implement your logic here
      return 0; // Replace with the actual count
    }
    return 0; // Default to 0 if no timestamp is recorded
  };

  return (
    <div className="p-4 h-full bg-blue-500">
      <div className="text-white">
        Welcome, {user ? user.name : "Guest"}!
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 mt-4"
        >
          Logout
        </button>
      </div>
      <div className="mt-4">
        <label
          htmlFor="chatroomName"
          className="block text-white font-medium text-sm mb-1"
        >
          Chatroom Name
        </label>
        <div className="flex">
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            ref={chatroomNameRef}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter Chatroom Name"
          />
          <button
            onClick={createChatroom}
            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
      <div className="mt-4 h-full">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id}>
            <span className="text-white mr-2">{chatroom.name}</span>
            <Link
              to={"/chatroom/" + chatroom._id}
              className="text-white-500 hover:text-blue-600"
            >
              Join
            </Link>
            {countUnreadMessages(chatroom._id) > 0 && (
              <span className="text-red-500 ml-2">
                {countUnreadMessages(chatroom._id)}
              </span>
            )}
          </div>
        ))}
        <Link
          to="/user-search"
          className="mt-4 text-blue-500 hover:text-blue-600 block"
        >
          Private Messages
        </Link>
      </div>
    </div>
  );
};

export default ChatHeaderPage;
