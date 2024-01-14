import React, { useState, useEffect } from "react";

function Chat() {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const newWs = new WebSocket("ws://localhost:3000");

    newWs.onopen = () => {
      console.log("WebSocket connected");
    };

    newWs.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    newWs.onclose = () => {
      console.log("WebSocket disconnected");
    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  // Placeholder function for logout
  const handleLogout = () => {
    console.log("Logout");
    // Implement logout functionality here
  };

  // Placeholder function for opening settings
  const openSettings = () => {
    console.log("Open settings");
    // Implement settings functionality here
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <div className="flex justify-between mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={openSettings}
          >
            Settings
          </button>
        </div>
        {/* Contact list goes here */}
        <ul>
          {/* Dynamically render contacts here */}
          <li className="py-2 px-4 hover:bg-gray-300 cursor-pointer">
            Contact 1
          </li>
          {/* Repeat for other contacts */}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Chat messages go here */}
          <p className="rounded-lg bg-blue-100 p-3 my-2">Incoming message</p>
          <p className="rounded-lg bg-green-100 p-3 my-2 self-end">
            Outgoing message
          </p>
          {/* Repeat for other messages */}
        </div>
        <div className="p-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Type a message"
          />
          {/* Add send button if needed */}
        </div>
      </div>
    </div>
  );
}

export default Chat;
