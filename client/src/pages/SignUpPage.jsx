// page for sign up view of the app
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SignUpPage = () => {
  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const nameRef = React.createRef();
  const navigate = useNavigate();

  const registerUser = () => {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;

    axios
      .post("http://localhost:3000/user/register", {
        username,
        password,
        name,
      })
      .then(() => {
        alert("User registered successfully!");
        navigate("/login");
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          console.error("Error:", err.response.data.message);
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
        <button onClick={registerUser}>Register</button>
      </div>
    </div>
  );
};

export default SignUpPage;
