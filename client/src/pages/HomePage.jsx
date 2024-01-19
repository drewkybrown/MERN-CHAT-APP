// create a home view for the app with a login button and register button
// that will redirect to the login and register pages respectively
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My Chat App</h1>
      <p>Get started by logging in or signing up!</p>
      <div>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
