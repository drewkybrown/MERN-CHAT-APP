import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import React from "react";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Room from "./pages/Room.jsx";

import Chats from "./pages/Chats.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chats", // Note that this is a relative path
        element: <Chats />,
      },
      {
        path: "/room/:roomId",
        element: <Room />,
      },
    ],
  },
]);

export default router;
