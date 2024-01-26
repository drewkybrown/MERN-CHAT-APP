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
      .get(`${apiUrl}/chatroom`, {
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
        `${apiUrl}/chatroom`,
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
    <div>
      <div>
        Welcome, {user ? user.name : "Guest"}!
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <label htmlFor="chatroomName">Chatroom Name</label>
        <input
          type="text"
          name="chatroomName"
          id="chatroomName"
          ref={chatroomNameRef}
          placeholder="Chatroom Name"
        />
      </div>
      <button onClick={createChatroom}>Create Chatroom</button>
      <div>
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id}>
            {chatroom.name}
            <Link to={"/chatroom/" + chatroom._id}>Join</Link>
            {countUnreadMessages(chatroom._id) > 0 && (
              <div>{countUnreadMessages(chatroom._id)}</div>
            )}
          </div>
        ))}
        <Link to="/user-search">Private Messages</Link>
      </div>
    </div>
  );
};

export default ChatHeaderPage;
