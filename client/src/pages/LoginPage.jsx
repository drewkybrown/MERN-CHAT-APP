import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const LoginPage = (props) => {
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const navigate = useNavigate();

  const loginUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    console.log("Logging in user...");

    axios
      .post("http://localhost:3000/user/login", {
        username,
        password,
      })
      .then((response) => {
        // Clear any existing session data
        localStorage.clear();

        // Store token and other necessary user data
        localStorage.setItem("CC_Token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Assuming 'user' data is part of the response

        console.log("User logged in successfully!", response.data.user);
        navigate("/dashboard");
        props.setupSocket();
      })
      .catch((err) => {
        // Error handling
        if (err?.response?.data?.message) {
          console.error("Login Error:", err.response.data.message);
          alert("Login failed: " + err.response.data.message); // Provide user feedback
        } else {
          console.error("Login Error:", err);
          alert("Login failed. Please try again.");
        }
      });
  };

  return (
    <div className="card">
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="username">Username</label>{" "}
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Your Username"
            ref={usernameRef}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            ref={passwordRef}
          />
        </div>
        <button onClick={loginUser}>Login</button>
      </div>
    </div>
  );
};

// Define propTypes for your props
LoginPage.propTypes = {
  setupSocket: PropTypes.func.isRequired,
};

export default LoginPage;
