/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "App.css";
import { RouterProvider } from "react-router-dom";
import PageRouter from "router";
import Layouts from "layouts";

import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
  return (
    <Layouts>
      <RouterProvider router={PageRouter} />
    </Layouts>
  );
}

export default App;
