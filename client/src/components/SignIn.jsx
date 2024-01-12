import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext"; // Import UserContext

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext); // Use UserContext

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        setUser(data); // Assuming your server responds with user data
        // You might want to navigate to a different page after successful sign in
      } else {
        // If we reach here, there was a server error
        console.error(
          "Error signing in:",
          response.status,
          response.statusText
        );
      }
    } catch (err) {
      // This catch block is for networking errors or if response.ok is false
      console.error("Network Error:", err);
    }
  }

  // The return statement for the component rendering should be here
  // It should include the form and its input fields for username and password
  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        {/* Password input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {/* Submit button */}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
