// Page for login view of the app
import React from "react";
import axios from "axios";
import PropTypes from "prop-types"; // Import PropTypes
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
        localStorage.setItem("CC_Token", response.data.token);
        console.log("User logged in successfully!");
        navigate("/dashboard");
        props.setupSocket();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          console.error("Error:", err.response.data.message); // Added console log
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
