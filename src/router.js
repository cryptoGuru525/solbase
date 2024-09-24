import React, { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Swap = lazy(() => import("pages/Swap"));
const Liquidity = lazy(() => import("pages/Liquidity"));
const NotFound = lazy(() => import("pages/Notfound"));
const Farms = lazy(() => import("pages/Farms"));
const NFTClaim = lazy(() => import("pages/NftClaim"));
const Presale = lazy(() => import("pages/Presale"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Farms />,
  },
  {
    path: "/farms",
    element: <Farms />,
  },
  {
    path: "/swap",
    element: <Swap />,
  },
  // {
  //   path: "/liquidity",
  //   element: <Liquidity />,
  // },
  {
    path: "/nfts",
    element: <NFTClaim />,
  },
  {
    path: "/presale",
    element: <Presale />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
