import React from "react";
import { notify } from "utils/toastHelper";
import { didUserReject } from "utils/customHelpers";
import { getPresaleContract } from "utils/contractHelpers";
import { CountDownComponentClaim } from "./CountDownClaim";

export default function ClaimComponent({ saleData }) {
  const presaleContract = getPresaleContract(null);

  const handleClaim = async () => {
    if (!Boolean(saleData.sale_finalized)) {
      notify("error", "Presale is not ended yet");
      return;
    }
    if (Number(saleData.user_deposits) === 0) {
      notify("error", "You do not have any tokens to claim");
      return;
    }
    try {
      const tx = await presaleContract.withdrawWILD({
        from: null,
      });
      await tx.wait();
      notify("success", "You claimed tokens successfully");
      // notify("info", "You can claim tokens again after 1 hours");
      window.localStorage.setItem("lastClaimedTime", Date.now());
    } catch (error) {
      if (didUserReject(error)) {
        notify("warning", "User Rejected transaction");
        return;
      } else {
        notify("warning", error.reason);
        return;
      }
    }
  };

  return (
    <div className="claim_card">
      <div className="py-8">
        <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
          <div> Your Claimed BWiLD:</div>
          <div>
            {saleData?.user_withdraw_amount || "0.00"} &nbsp;{" "}
            <span className="text-[10.5px] text-sm">BWiLD</span>
          </div>
        </div>
        <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
          <div> Remains BWiLD:</div>
          <div>
            {saleData?.WILDOwned - saleData?.user_withdraw_amount || "0.00"}{" "}
            &nbsp; <span className="text-[10.5px] text-sm">BWiLD</span>
          </div>
        </div>
        <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
          <div> Next Claim in:</div>
          <div>
            {Boolean(saleData?.sale_finalized) ? (
              <>
                {Boolean(saleData?.sale_finalized) &&
                saleData?.user_withdraw_timestamp === 0 ? (
                  <>
                    <CountDownComponentClaim
                      time={(Number(saleData.finishedTimestamp) + 180) * 1000}
                      key={saleData.finishedTimestamp}
                    />
                  </>
                ) : (
                  <>
                    <CountDownComponentClaim
                      time={
                        (Number(saleData.user_withdraw_timestamp) + 180) * 1000
                      }
                      key={saleData.user_withdraw_timestamp}
                    />
                  </>
                )}
              </>
            ) : (
              "0000-00-00 00:00:00"
            )}
          </div>
        </div>
      </div>

      <button
        className="main_btn w-full"
        onClick={() => handleClaim()}
        disabled={!Boolean(saleData?.sale_finalized) ? "disabled" : ""}
      >
        {!Boolean(saleData?.sale_finalized)
          ? "Preslae is not ended yet"
          : Number(saleData?.getAmountToWithdraw)
          ? "You don't have any tokens to claim"
          : "ClAIM WILD"}
      </button>
    </div>
  );
}
