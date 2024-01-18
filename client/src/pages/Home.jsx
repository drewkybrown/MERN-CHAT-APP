import { Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import React from "react";

function Home() {
  const { socket } = useOutletContext();
  console.log(socket);
  return <Typography variant="h1">Home</Typography>;
}

export default Home;
