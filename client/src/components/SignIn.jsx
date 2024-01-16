import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUpRedirect = () => {
    console.log("Navigating to /signup"); // Added log
    navigate("/signup");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log("Submitting sign-in with:", { username, password }); // Log the submitted data
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log("Success - Response Data:", data); // Log the response data

        setUser(data);
        console.log("Navigating to /chat"); // Log before navigating
        navigate("/chat");
      } else {
        console.error(
          "Error signing in:",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      console.error("Network Error:", err);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md px-4 py-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>

          {/* Navigation to Sign Up */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSignUpRedirect}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Not a member? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
