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
    try {
      const apiUrl =
        typeof process !== "undefined" && process.env.REACT_APP_API_URL
          ? process.env.REACT_APP_API_URL
          : "http://localhost:3000";
      const response = await axios.get(`${apiUrl}/user/search`, {
        params: { search: searchTerm },
      });
      setSearchResults(response.data);
    } catch (error) {
      setError("Search failed. Please try again.");
    }
  };

  const initiateConversation = (userId, username) => {
    navigate(`/private-messages/${userId}`, { state: { username } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-6">
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md flex items-center mb-6"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="flex-1 border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="w-full max-w-md list-none">
        {searchResults.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center bg-white p-3 rounded-lg shadow mb-2"
          >
            <span className="font-medium text-gray-800">{user.name}</span>
            <button
              onClick={() => initiateConversation(user._id, user.username)}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
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
