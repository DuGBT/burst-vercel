import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Stake from "./Stake.jsx";
import Claim from "./Claim.jsx";
import Lock from "./Lock";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Stake />,
  },
  {
    path: "/stake",
    element: <Stake />,
  },
  {
    path: "/claim",
    element: <Claim />,
  },
  {
    path: "/lock",
    element: <Lock />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
