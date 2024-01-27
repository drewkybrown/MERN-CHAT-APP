import React, { useRef } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const navigate = useNavigate();

  const SignUpUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    const apiUrl =
      import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

    axios
      .post(`${apiUrl}/api/user/register`, {
        username,
        password,
        name,
      })
      .then(() => {
        toast.success("User registered successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        ) {
          toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-300 to-red-300">
      <div className="w-full max-w-md p-6 bg-white bg-opacity-90 rounded-lg shadow-lg">
        <div className="text-3xl font-semibold text-gray-800 mb-4 text-center">
          Sign Up
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Full Name"
            ref={nameRef}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
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
          onClick={SignUpUser}
          className="w-full px-6 py-3 text-white bg-purple-500 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          Register
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already a member?{" "}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 ml-1">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
