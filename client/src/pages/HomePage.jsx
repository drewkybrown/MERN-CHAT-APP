import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Navigating to login page...");
    navigate("/login");
  };

  const handleRegister = () => {
    console.log("Navigating to register page...");
    navigate("/register");
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 via-purple-300 to-blue-400 h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to Chatcord!
      </h1>
      <div className="space-x-4">
        <button
          onClick={handleLogin}
          className="px-6 py-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          className="px-6 py-3 text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Register
        </button>
      </div>
      {/* Additional content here */}
    </div>
  );
};

export default HomePage;
