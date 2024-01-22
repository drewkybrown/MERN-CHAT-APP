import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Navigating to login page..."); // Added console log
    navigate("/login");
  };

  const handleRegister = () => {
    console.log("Navigating to register page..."); // Added console log
    navigate("/register");
  };

  return (
    <div>
      <h1>Welcome to the Chat Application</h1>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      {/* Additional content here */}
    </div>
  );
};

export default HomePage;
