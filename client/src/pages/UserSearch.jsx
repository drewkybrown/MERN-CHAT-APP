import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Search initiated with term:", searchTerm); // Added console log
    try {
      const response = await axios.get(`http://localhost:3000/user/search`, {
        params: { search: searchTerm },
      });
      console.log("Search results:", response.data); // Added console log
      setSearchResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Search failed. Please try again.");
    }
  };

  const initiateConversation = (userId, username) => {
    // Use both userId and username when navigating to private messages
    console.log("Initiating conversation with user:", username); // Added console log
    navigate(`/private-messages/${userId}`, { state: { username } });
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit">Search</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {searchResults.map((user) => (
          <li key={user._id}>
            {user.name}
            <button
              onClick={() => initiateConversation(user._id, user.username)}
            >
              Message
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
