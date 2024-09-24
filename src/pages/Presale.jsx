import React, { useState } from "react";
import SaleComponent from "components/SaleComponent";
import { CountDownComponent } from "../components/CountDown";

export default function Presale() {
  const [active, setActive] = useState(1);
  const [ended, setEnded] = useState(false);

  return (
    <div className="w-full container flex flex-col justify-center items-center max-w-[500px] mx-3">
      {/* {!ended && ( */}
      <>
        <span className="text-center text-3xl font-bold  p-3 rounded-md mb-2 backdrop-blur-sm">
          BILL TOKEN <br />
          PRESALE
        </span>
        <p className="text-xl font-bold">FARM LAUNCHING IN MAY 🚀</p>
        {/* <CountDownComponent endDate={1713175777000} setEnded={setEnded} /> */}
      </>
      {/* )} */}
      <div className="bg-secondary px-4 py-6 rounded-lg flex w-full justify-center presale_form">
        <SaleComponent />
      </div>
      <img
        src="/assets/stickers/presale-left.webp"
        alt=""
        className="fixed animate-pulse duration-1000 w-[100px] sm:w-[200px] md:w-[250px] lg:w-[350px] -z-[999] sm:inline-block bottom-8 left-64"
      />
      <img
        src="/assets/stickers/presale-right.webp"
        alt=""
        className="fixed animate-pulse duration-1000 w-[100px] sm:w-[200px] md:w-[250px] lg:w-[350px] -z-[999] sm:inline-block bottom-8 right-3"
      />
    </div>
  );
}
