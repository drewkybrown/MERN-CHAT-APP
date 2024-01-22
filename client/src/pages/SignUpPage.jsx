import React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link

const SignUpPage = () => {
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const nameRef = React.createRef();
  const navigate = useNavigate();

  const SignUpUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    console.log("Signing up user..."); // Added console log

    axios
      .post("http://localhost:3000/user/register", {
        username,
        password,
        name,
      })
      .then(() => {
        console.log("User registered successfully!"); // Added console log
        alert("User registered successfully!");
        navigate("/login");
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
      <div className="cardHeader">Register</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="username">Username</label>
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
        <div className="inputGroup">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            ref={nameRef}
          />
        </div>
        <button onClick={SignUpUser}>Register</button>

        {/* Add a button to navigate back to the Login page */}
        <Link to="/login">
          <button>Already a Member? Login</button>
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
