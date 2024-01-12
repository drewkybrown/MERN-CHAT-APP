import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // You can set initial user state here

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
