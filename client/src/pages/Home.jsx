import { Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import React from "react";

function Home() {
  const { socket } = useOutletContext();
  console.log(socket);
  return (
    <h1 className="text-4xl font-bold text-center my-5">
      Welcome to my Chat App
    </h1>
  );
}

export default Home;
