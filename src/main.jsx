import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Stake from "./Stake.jsx";
import Claim from "./Claim.jsx";
import Lock from "./Lock";
import ScrollPagination from "./Landing.jsx";
import { Web3OnboardProvider, init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { MyContextProvider } from "./Context";

const INFURA_KEY = "b0caabe4b0bc4153a499536aa88a053d";

const injected = injectedModule();

const wallets = [injected];

const chains = [
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  },
  {
    id: "0x5",
    token: "ETH",
    label: "Goerli",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  },
];

const web3Onboard = init({
  connect: {
    autoConnectAllPreviousWallet: true,
  },
  wallets,
  chains,
  //   appMetadata,
});
const router = createBrowserRouter([
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
  {
    path: "/",
    element: <ScrollPagination />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Web3OnboardProvider web3Onboard={web3Onboard}>
    <MyContextProvider>
      <RouterProvider router={router} />
    </MyContextProvider>
  </Web3OnboardProvider>
);
