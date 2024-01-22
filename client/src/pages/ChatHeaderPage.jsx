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

  return (
    <div className="card">
      <div className="cardHeader">
        Welcome, {user ? user.name : "Guest"}!
        <button onClick={logout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            ref={chatroomNameRef}
            placeholder="ChatterBox Nepal"
          />
        </div>
      </div>
      <button onClick={createChatroom}>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
        <Link to="/user-search">Private Messages</Link>
      </div>
    </div>
  );
};

export default ChatHeaderPage;
