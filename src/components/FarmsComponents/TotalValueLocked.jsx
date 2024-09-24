import React from "react";
import { useTotalSupply } from "hooks/useTokenBalance";
import { usePriceBWiLDUsdc, useTotalValue } from "state/hooks";
import CardValue from "./Staking/CardValue";
import { convertCurrency } from "utils/customHelpers";

export default function TotalValueLocked() {
  const tvlData = useTotalValue();
  const tvl = tvlData
    ? tvlData.toLocaleString("en-US", { maximumFractionDigits: 1 })
    : 0;
  const liquidity = usePriceBWiLDUsdc()[1];
  const marketCap = usePriceBWiLDUsdc()[2];

  const totalSupply = useTotalSupply();
  // 0xeAA13b4f85A98E6CcaF65606361BD590e98DE2Cb

  const totalMinted = totalSupply;
  return (
    <div className="flex gap-4 items-center justify-center bg-primary p-2 rounded-md ">
      <div className="text-3xl text-right  font-semibold text-symbol sol-text">
        TVL:
      </div>
      <div className="flex items-center justify-center">
        {tvlData !== null ? (
          <div color="#fff" className="text-2xl font-semibold text-right">
            {`$${tvl}`}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
