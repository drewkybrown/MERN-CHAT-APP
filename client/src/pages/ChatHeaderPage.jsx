import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ChatHeaderPage = () => {
  const [chatrooms, setChatrooms] = React.useState([]);
  const navigate = useNavigate();
  const chatroomNameRef = React.createRef();

  const getChatrooms = () => {
    axios
      .get("http://localhost:3000/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        console.error("Error fetching chatrooms:", err);
        setTimeout(getChatrooms, 3000);
      });
  };

  React.useEffect(() => {
    getChatrooms();
  }, []);

  const createChatroom = () => {
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
        getChatrooms();
        chatroomNameRef.current.value = "";
      })
      .catch((err) => {
        console.error("Error creating chatroom:", err);
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
        <button onClick={createChatroom}>Create Chatroom</button>{" "}
        {/* Create Chatroom button */}
      </div>
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
