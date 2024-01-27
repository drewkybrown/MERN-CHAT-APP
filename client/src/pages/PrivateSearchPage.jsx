import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import PrivateChatPage from "./PrivateChatPage"; // Import PrivateChatPage component

function PrivateSearchPage({ socket }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Listen for incoming private messages and set the selected user
    socket.on("new private message", (message) => {
      setSelectedUser(message.senderId);
    });

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off("new private message");
    };
  }, [socket]);

  const searchUsers = async () => {
    try {
      // Construct the URL from the environment variable or use a fallback
      const apiUrl =
        import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";
      const searchUrl = `${apiUrl}/api/user/search?search=${searchTerm}`;

      const { data } = await axios.get(searchUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("CC_Token")}`,
        },
      });
      setUsers(data); // Assuming the server response is directly the list of users
    } catch (error) {
      console.error(
        "Failed to search users:",
        error.response ? error.response.data : error.message
      );
      // Optionally, handle the error in UI, e.g., showing a message to the user
    }
  };

  // Function to start a private chat with a user
  const startPrivateChat = (user) => {
    setSelectedUser(user._id); // Set the selected user for private chat

    // Emit an event to the server to start a private chat with the selected user
    socket.emit("private chat start", { receiverId: user._id });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <h1 className="text-3xl font-semibold mb-4">Private Chat</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for users..."
          className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={searchUsers}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
        >
          Search
        </button>
        <ul className="mt-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center py-2 border-b border-gray-300"
            >
              <span className="text-lg">{user.username}</span>
              <button
                onClick={() => startPrivateChat(user)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
              >
                Click to chat
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 bg-white">
        {selectedUser && (
          <>
            <Link
              to={`/private/${selectedUser}`}
              className="block mt-4 text-blue-500 hover:text-blue-600"
            >
              Start private chat with {selectedUser}
            </Link>
            {/* Conditionally render PrivateChatPage */}
            <PrivateChatPage socket={socket} />
          </>
        )}
      </div>
    </div>
  );
}

// Define PropTypes for the PrivateSearchPage component
PrivateSearchPage.propTypes = {
  socket: PropTypes.object.isRequired, // Adjust the prop type as needed
};

export default PrivateSearchPage;
