import React, { useEffect, useState } from "react";
import { getBWiLDContract } from "utils/contractHelpers";

export default function CurrentSaleTax() {
  const [taxRate, setTaxRate] = useState(0);
  const getCurrentTaxRate = async () => {};

  return (
    <div className="text-[40px] font-semibold text-white">
      {Number(taxRate).toFixed(2)} %
    </div>
  );
}
