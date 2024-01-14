import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Chat from "./components/Chat";

function App() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap components with UserProvider */}
      <Router>
        {" "}
        {/* Wrap routes with Router */}
        <Routes>
          {" "}
          <Route path="/signup" element={<SignUp />} />{" "}
          {/* Define route for SignUp */}
          <Route path="/signin" element={<SignIn />} />{" "}
          <Route path="/chat" element={<Chat />} />{" "}
          {/* Define route for SignIn */}
          {/* Add other routes as needed */}
          {/* Redirect to /signin as default */}
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
