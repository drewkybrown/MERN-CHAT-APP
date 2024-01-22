import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling

const SignUpPage = () => {
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const nameRef = React.createRef();
  const navigate = useNavigate();

  const SignUpUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    console.log("Signing up user...");

    axios
      .post("http://localhost:3000/user/register", {
        username,
        password,
        name,
      })
      .then(() => {
        console.log("User registered successfully!");
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
          console.error("Error:", err.response.data.message);
        }
      });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="card w-full max-w-sm p-6 bg-white shadow-lg rounded">
        <div className="cardHeader text-2xl font-semibold text-gray-800 mb-4">
          Register
        </div>
        <div className="inputGroup mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            ref={nameRef}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
          />
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
          <div className="inputGroup mb-4">
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
            className="w-full px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
          >
            Register
          </button>
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Already a Member? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
