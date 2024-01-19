// page to handle errors or incorrect routes or token errors
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    console.log("Checking token:", token); // Added console log
    if (!token) {
      console.log("Token not found. Redirecting to login..."); // Added console log
      navigate("/login");
    } else {
      console.log("Token found. Redirecting to dashboard..."); // Added console log
      navigate("/dashboard");
    }
    // eslint-disable-next-line
  }, []);

  return <div></div>;
};

export default ErrorPage;
