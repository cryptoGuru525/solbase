import React, { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";
import { formatAddress } from "utils/customHelpers";
import { useWallet } from "@solana/wallet-adapter-react";
import TotalValueLocked from "./TotalValueLocked";
import FarmStaking from "components/FarmsComponents/StakingInfo";
import { CountDownComponent } from "components/CountDown";

export default function FarmBanner() {
  const [isCopied, setIsCopied] = useState(false);
  const wallet = useWallet();
  const [wildAddress, setWildAddress] = useState(
    wallet?.publicKey?.toString() || "Connect correct wallet"
  );
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setWildAddress(wallet?.publicKey?.toString());
  }, [wallet?.publicKey]);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col rounded-md">
      {/* <div> */}
        {/* <p className="text-center text-3xl font-bold shadow-md shadow-black/50 py-3 bg-secondary/40 rounded-md mb-2 backdrop-blur-sm"> */}
          {/* FARMS LAUNCHING IN MAY 🚀 */}
        {/* </p> */}
        {/* <CountDownComponent endDate={1713175777000} setEnded={setEnded} /> */}
      {/* </div> */}

      <div className="flex justify-center flex-col md:flex-row items-center bg-secondary">
        <div className="p-3 md:p-4 md:w-2/3 w-full text-center md:text-left">
          <h1 className="text-5xl">
            <span className="text-symbol font-semibold text-green-500 sol-text">
              {" "}
              Stake Liquidity & Earn
            </span>
          </h1>
        </div>
        <div className="flex justify-end p-3 md:p-6 w-fill md:w-1/3">
          <TotalValueLocked />
        </div>
      </div>

      <div className="flex justify-center items-center bg-secondary p-1">
        <FarmStaking />
      </div>
    </div>
  );
}
