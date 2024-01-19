import React from "react";
import { useEffect, useState } from "react";

import { useOutletContext, useParams } from "react-router-dom";

function ChatDash() {
  const { socket } = useOutletContext();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const { roomId } = useParams();

  useEffect(() => {
    if (!socket) return;
    socket.on("message-from-server", (data) => {
      setChat((prev) => [...prev, { message: data.message, received: true }]);
    });
    // socket.on("message-from-server", (data) => {
    // console.log("Message received", data);
    socket.on("typing-from-server", () => {
      setTyping(true);
      console.log("Someone is typing");
    });

    socket.on("typing-stopped-from-server", () => {
      setTyping(false);
      console.log("Someone stopped typing");
    });
  }, [socket]);

  function handleForm(e) {
    e.preventDefault();
    socket.emit("send-message", { message, roomId });
    setChat((prev) => [...prev, { message, received: false }]);
    console.log(message);
    setMessage("");
  }

  const [typingTimeout, settypingTimeout] = useState(null);

  function handleInput(e) {
    setMessage(e.target.value);
    socket.emit("typing-started-from-server", { roomId });
    if (typingTimeout) clearTimeout(typingTimeout);
    settypingTimeout(
      setTimeout(() => {
        //   socket.emit("typing-stopped-from-server");
        socket.emit("typing-stopped-from-server", { roomId });
        console.log("stopped typing");
      }, 1000)
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg">
        {roomId && (
          <div className="text-lg text-center font-bold py-2">{roomId}</div>
        )}

        <div className="overflow-y-auto max-h-80 p-4">
          {chat.map((data, index) => (
            <div
              key={index}
              className={`flex my-1 ${
                data.received ? "justify-start" : "justify-end"
              }`}
            >
              <p
                className={`text-sm p-2 rounded-lg max-w-xs ${
                  data.received
                    ? "bg-blue-100 rounded-br-none"
                    : "bg-green-100 rounded-bl-none"
                }`}
              >
                {data.message}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleForm} className="p-4 border-t border-gray-300">
          {typing && (
            <div className="text-xs text-gray-500 mb-1">Typing...</div>
          )}
          <div className="flex space-x-2">
            <input
              id="message-input"
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Write your message here"
              value={message}
              onChange={handleInput}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatDash;
