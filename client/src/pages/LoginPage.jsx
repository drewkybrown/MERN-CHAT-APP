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
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="card w-full max-w-sm p-6 bg-white shadow-lg rounded">
        <div className="cardHeader text-2xl font-semibold text-gray-800 mb-4">
          Login
        </div>
        <div className="cardBody">
          <div className="inputGroup mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Your Username"
              ref={usernameRef}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="inputGroup mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your Password"
              ref={passwordRef}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            onClick={loginUser}
            className="w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600">
            Not a member?
            <a
              href="/register"
              className="text-blue-500 hover:text-blue-600 ml-1"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Define propTypes for your props
LoginPage.propTypes = {
  setupSocket: PropTypes.func.isRequired,
};

export default LoginPage;
