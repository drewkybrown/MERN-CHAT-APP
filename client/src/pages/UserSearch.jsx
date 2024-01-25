import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSearch = ({ loggedInUserId }) => {
  const [username, setUsername] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const apiURL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

  const handleSearch = async () => {
    try {
      // Get the authentication token from localStorage
      const authToken = localStorage.getItem("CC_Token");

      console.log("Auth Token:", authToken); // Log the authentication token

      const response = await axios.get(
        `${apiURL}/private-message/search-users?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include the token in the headers
          },
        }
      );

      console.log("Search Response:", response.data); // Log the search response

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      console.error("Error details:", error.response);
    }
  };

  const handleMessageUser = (selectedUserId) => {
    console.log("Selected User ID:", selectedUserId); // Log the selected user ID
    navigate(`/private-messages/${loggedInUserId}/${selectedUserId}`);
  };

  return (
    <div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Search users..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => handleMessageUser(user._id)}>Message</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
