import React from "react";
import "./App.css";
import SignUp from "./components/SignUp";
import { UserProvider } from "./contexts/UserContext"; // Import UserProvider

function App() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap components with UserProvider */}
      <SignUp />
    </UserProvider>
  );
}

export default App;
