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

  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("CC_Token");
    localStorage.removeItem("loggedIn");

    // Redirect to the login page
    navigate("/login");
  };

  const getChatrooms = () => {
    console.log("Fetching chatrooms...");
    axios
      .get("http://localhost:3000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        console.log("Chatrooms fetched successfully!");
        setChatrooms(response.data);
      })
      .catch((err) => {
        console.error("Error fetching chatrooms:", err);
        setTimeout(getChatrooms, 3000);
      });
  };

  useEffect(() => {
    console.log("Getting initial chatrooms...");
    getChatrooms();
  }, []);

  const createChatroom = () => {
    console.log("Creating chatroom...");
    const chatroomName = chatroomNameRef.current.value;

    axios
      .post(
        "http://localhost:3000/chatroom",
        { name: chatroomName },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("CC_Token"),
          },
        }
      )
      .then((response) => {
        console.log("Chatroom created successfully!");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-gray-100">
      <div className="card w-full max-w-lg p-6 bg-white shadow-xl rounded-lg transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
        <div className="cardHeader flex justify-between items-center mb-4">
          <span className="text-2xl font-semibold text-gray-700">
            Welcome, {user ? user.name : "Guest"}!
          </span>
          <button
            onClick={logout}
            className="px-4 py-1 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300"
            style={{ marginLeft: "10px" }}
          >
            Logout
          </button>
        </div>
        <div className="cardBody">
          <div className="inputGroup mb-4">
            <label
              htmlFor="chatroomName"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Chatroom Name
            </label>
            <input
              type="text"
              name="chatroomName"
              id="chatroomName"
              ref={chatroomNameRef}
              placeholder="Chatroom Name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400 transition duration-300"
            />
          </div>
        </div>
        <button
          onClick={createChatroom}
          className="w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 transition duration-300"
        >
          Create Chatroom
        </button>
        <div className="chatrooms space-y-2">
          {chatrooms.map((chatroom) => (
            <div
              key={chatroom._id}
              className="chatroom p-4 bg-gray-200 rounded flex justify-between items-center hover:bg-gray-300 transition duration-300"
            >
              <div>{chatroom.name}</div>
              <Link to={"/chatroom/" + chatroom._id}>
                <div className="join text-blue-500 hover:text-blue-700 cursor-pointer transition duration-300">
                  Join
                </div>
              </Link>
              {/* Display a notification badge if there are unread messages */}
              {countUnreadMessages(chatroom._id) > 0 && (
                <div className="notification-badge bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  {countUnreadMessages(chatroom._id)}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/user-search"
            className="text-sm text-blue-500 hover:text-blue-700 mt-4 transition duration-300"
          >
            Private Messages
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatHeaderPage;
