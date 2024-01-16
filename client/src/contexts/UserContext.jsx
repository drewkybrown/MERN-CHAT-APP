import React, { createContext, useContext, useEffect, useState } from "react";
import * as jwt_decode from "jwt-decode"; // Import jwt_decode as a module

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from JWT stored in localStorage on component mount
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      // Decode JWT and extract user data here
      const decodedUser = decodeJWT(jwtToken); // Use the decodeJWT function
      setUser(decodedUser);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Function to decode JWT
const decodeJWT = (jwtToken) => {
  try {
    // Decode the JWT token and extract user data
    const user = jwt_decode(jwtToken);
    return user;
  } catch (error) {
    // Handle any errors that occur during decoding
    console.error("Error decoding JWT:", error);
    return null; // Return null if decoding fails
  }
};
