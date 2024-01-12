import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes instead of Switch
import { UserProvider } from "./contexts/UserContext"; // Import UserProvider
import SignUp from "./components/SignUp"; // Import SignUp component
import SignIn from "./components/SignIn"; // Import SignIn component - ensure you've created this

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
          {/* Use Routes instead of Switch */}
          <Route path="/signup" element={<SignUp />} />{" "}
          {/* Define route for SignUp */}
          <Route path="/signin" element={<SignIn />} />{" "}
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
