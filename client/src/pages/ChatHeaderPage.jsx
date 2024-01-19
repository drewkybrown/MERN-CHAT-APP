import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ChatHeaderPage = () => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const navigate = useNavigate(); // Add this if you need programmatic navigation
  const chatroomNameRef = React.createRef();

  const getChatrooms = () => {
    console.log("Fetching chatrooms..."); // Added console log
    axios
      .get("http://localhost:3000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        console.log("Chatrooms fetched successfully!"); // Added console log
        setChatrooms(response.data);
      })
      .catch((err) => {
        console.error("Error fetching chatrooms:", err); // Added console log
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  const createChatroom = () => {
    console.log("Creating chatroom..."); // Added console log
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
        console.log("Chatroom created successfully!"); // Added console log
        getChatrooms();
        chatroomNameRef.current.value = "";
        // You can use navigate here if you need to redirect after creation
        // navigate('/some-route');
      })
      .catch((err) => {
        console.error("Error creating chatroom:", err); // Added console log
        // Handle error here if needed
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
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
      </div>
    </div>
  );
};

export default ChatHeaderPage;
