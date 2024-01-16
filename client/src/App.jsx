import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider, UserContext } from "./contexts/UserContext"; // Import UserContext here
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Chat from "./components/Chat";

function App() {
  console.log("App.js: App component rendered"); // Log when App component is rendered

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/chat" element={<ProtectedRoute component={Chat} />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

// A component to protect routes that require authentication
const ProtectedRoute = ({ component: Component }) => {
  const { user } = useContext(UserContext);

  // If user is authenticated, render the component; otherwise, redirect to SignIn
  if (user) {
    console.log("User is authenticated:", user); // Log user data
    return <Component currentUserId={user._id} />;
  } else {
    console.log("User is not authenticated. Redirecting to SignIn"); // Log when the user is not authenticated
    return <SignIn />;
  }
};

export default App;
