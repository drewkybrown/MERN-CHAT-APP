import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Route } from "react-router-dom";
import router from "./router.jsx"; // Ensure this path is correct
import "./index.css"; // And other global styles or setup if you have
import App from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
