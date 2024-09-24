import React, { useState } from "react";
import { useFarmsWithBalance } from "hooks/useFarmsWithBalance";
import WiLDHarvestBalance from "./Staking/WiLDHarvestBalance";
import WiLDWalletBalance from "./Staking/WiLDWalletBalance";
import CompoundModal from "./CompoundModal";
import BigNumber from "bignumber.js";
import { DEFAULT_TOKEN_DECIMAL } from "config";

export default function FarmStaking() {
  const [open, setOpen] = useState(false);
  const [pids, setPids] = useState([]);

  const farmsWithBalance = useFarmsWithBalance();

  const balancesWithValue = farmsWithBalance.filter((balanceType) =>
    balanceType.balance.gt(0)
  );
  const earningsSum = farmsWithBalance.reduce((accum, earning) => {
    const earningNumber = new BigNumber(earning.balance);
    if (earningNumber.eq(0)) {
      return accum;
    }
    return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber();
  }, 0);

  function closeModal() {
    setOpen(false);
  }

  return (
    <div className="flex-1 bg-primary p-1">
      <div className="flex justify-around items-center">
        <div className="flex justify-center gap-1 items-center">
          <div className="text-base font-semibold sol-text">
            Gold to Harvest:
          </div>
          <div className="text-sm text-gray-300"></div>
        </div>
        <div className="flex justify-center gap-1 items-center">
          <div className="text-base font-semibold sol-text">
            BiLL in Wallet:
          </div>
          <div className="text-sm text-gray-300"></div>
        </div>
      </div>
      {open && (
        <CompoundModal
          open={open}
          closeModal={closeModal}
          earnings={earningsSum}
          pid={pids}
          isAll={true}
        />
      )}
    </div>
  );
}
