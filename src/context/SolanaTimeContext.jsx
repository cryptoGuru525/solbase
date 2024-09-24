import React, { createContext, useContext, useEffect, useState } from "react";
import { getSolanaTime } from "utils/checkerHelper";
import { useUmi } from "./useUmi";
import BigInt from "big-integer";
const SolanaTimeContext = createContext({
  solanaTime: 0,
});

export const useSolanaTime = () => useContext(SolanaTimeContext).solanaTime;

export const SolanaTimeProvider = ({ children }) => {
  const umi = useUmi();
  const [solanaTime, setSolanaTime] = useState(BigInt(0));

  useEffect(() => {
    const fetchSolanaTime = async () => {
      const tempSolanaTime = await getSolanaTime(umi);
      setSolanaTime(tempSolanaTime);
    };
    fetchSolanaTime();
  }, [umi]);

  return (
    <SolanaTimeContext.Provider value={{ solanaTime }}>
      {children}
    </SolanaTimeContext.Provider>
  );
};
