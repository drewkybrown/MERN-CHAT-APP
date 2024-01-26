import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = (props) => {
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const navigate = useNavigate();

  const loginUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    console.log("Logging in user...");
    console.log("Username:", username);
    console.log("Password:", password);

    const apiUrl =
      import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

    axios
      .post(`${apiUrl}/api/user/login`, {
        username,
        password,
      })
      .then((response) => {
        localStorage.clear();
        localStorage.setItem("CC_Token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log("User logged in successfully!", response.data.user);
        console.log("URL for login request:", `${apiUrl}/api/user/login`);

        navigate("/dashboard");
        props.setupSocket();
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          console.error("Login Error:", err.response.data.message);
          alert("Login failed: " + err.response.data.message);
        } else {
          console.error("Login Error:", err);
          alert("Login failed. Please try again.");
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-300">
      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <div className="text-2xl font-semibold text-gray-800 mb-4">Login</div>
        <div className="mb-4">
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
        <div className="mb-6">
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
        <p className="text-sm text-center text-gray-600 mt-4">
          Not a member?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 ml-1"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  setupSocket: PropTypes.func.isRequired,
};

export default LoginPage;
