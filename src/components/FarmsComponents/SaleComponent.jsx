import React, { useState, useEffect } from "react";
import { Line } from "rc-progress";
import {
  minPrivatePurchase,
  minPublicPurchase,
  maxPrivatePurchase,
  maxPublicPurchase,
} from "config";
import { notify } from "utils/toastHelper";

export default function SaleComponent({
  totalRaised,
  isPrivateParticipant,
  buyBWiLDToken,
  userDeposited,
  hasNFT,
  started,
  finished,
}) {
  const [amount, setAmount] = useState(0);
  const [minimum, setMinimum] = useState(
    isPrivateParticipant ? minPrivatePurchase : minPublicPurchase
  );
  const [maximum, setMaximum] = useState(
    isPrivateParticipant ? maxPrivatePurchase : maxPublicPurchase
  );

  const handleChange = (value) => {
    setAmount(value);
  };

  useEffect(() => {
    setMinimum(isPrivateParticipant ? minPrivatePurchase : minPublicPurchase);
    setMaximum(isPrivateParticipant ? maxPrivatePurchase : maxPublicPurchase);
  }, [isPrivateParticipant]);

  const handleBuyWild = () => {
    if (!started) {
      notify("error", "Presale is not started yet");
      return;
    }
    if (finished) {
      notify("error", "Presale is ended");
      return;
    }
    if (amount < minimum) {
      notify("warning", "Amount should be greater than " + minimum);
      return;
    }
    if (amount > maximum - Number(userDeposited)) {
      notify(
        "warning",
        "Amount should be less than " + maximum - Number(userDeposited)
      );
      return;
    }
    if (Number("0") < Number(amount)) {
      notify("warning", "Insufficient Balance");
      return;
    }
    buyBWiLDToken(amount);
  };

  return (
    <div>
      <div className="sale_percent_bar">
        <div className="text">{totalRaised} / 100 SOL</div>
        <div className="text">{Number(Number(totalRaised)).toFixed(2)}%</div>
      </div>
      <Line
        percent={Number(Number(totalRaised) / 100).toFixed(2)}
        strokeWidth={2}
        strokeColor="#2a8710"
        trailColor="#00162fb0"
        trailWidth={3}
        style={{ margin: "17px 0 30px 0" }}
      />
      <div className="balance_form">
        <div className="flex justify-between p-1">
          <div>Minimum Purchase:</div>
          <div>{minimum} SOL</div>
        </div>
        <div className="flex justify-between p-1 mb-2">
          <div>Maximum Purchase: </div>
          <div>{maximum} SOL</div>
        </div>
        <div className="form_text">Balance: 0 SOL</div>
        <div className="form_input">
          <input
            type="number"
            placeholder="0"
            value={amount}
            min={minimum}
            max={maximum}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      </div>
      <button
        className="btn buy_btn"
        onClick={() => handleBuyWild()}
        disabled={!hasNFT || !started || finished ? "dissabled" : ""}
      >
        {!hasNFT
          ? "You must have BWiLD NFT to buy token!"
          : !started
          ? "Presale is not started yet"
          : finished
          ? "Preslae is ended"
          : "BUY BWiLD"}
      </button>
    </div>
  );
}
