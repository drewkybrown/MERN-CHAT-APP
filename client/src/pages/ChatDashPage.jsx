import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

const ChatDashPage = ({ socket }) => {
  const { id: chatroomId } = useParams(); // Get chatroom ID from URL params
  const [messages, setMessages] = React.useState([]);
  const messageRef = React.useRef();
  const [userId, setUserId] = React.useState("");

  const sendMessage = () => {
    if (socket) {
      console.log("Sending message...");
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      console.log("Listening for new messages...");
      socket.on("newMessage", (message) => {
        const newMessages = [...messages, message];
        setMessages(newMessages);
        console.log("New message received:", message);
      });
    }

    // Join the chatroom
    if (socket) {
      console.log("Joining chatroom...");
      socket.emit("joinRoom", { chatroomId });
    }

    // Leave the chatroom when component unmounts
    return () => {
      if (socket) {
        console.log("Leaving chatroom...");
        socket.emit("leaveRoom", { chatroomId });
      }
    };
  }, [chatroomId, messages, socket]);

  // Conditional rendering when socket is null
  if (!socket) {
    return <div>Loading...</div>; // or any other placeholder content
  }

  return (
    <div>
      <div>Chatroom Name</div>
      <div>
        {messages.map((message, i) => (
          <div key={i}>
            <span>{message.name}:</span> {message.message}
          </div>
        ))}
      </div>
      <div>
        <div>
          <input
            type="text"
            name="message"
            placeholder="Say something!"
            ref={messageRef}
          />
        </div>
        <div>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

// Prop validation
ChatDashPage.propTypes = {
  socket: PropTypes.object, // Adjust the type to match your socket object type
};

export default ChatDashPage;
