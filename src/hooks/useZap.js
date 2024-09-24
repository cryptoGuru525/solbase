import { useCallback } from "react";
import { zap, zapForFarm } from "utils/callHelpers";
import { useZapContract } from "./useContract";

const useZap = () => {
  const zapContract = useZapContract();

  const handleZap = useCallback(
    async (tokenA, isNative, amount, tokenB, isNativeOut) => {
      await zap(
        zapContract,
        tokenA,
        isNative,
        amount,
        tokenB,
        isNativeOut,
        null
      );
    },
    [zapContract]
  );

  return { onZap: handleZap };
};

export const useZapForFarm = () => {
  const zapContract = useZapContract();

  const handleZap = useCallback(
    async (tokenA, isNative, amount, tokenB, pid) => {
      await zapForFarm(
        zapContract,
        tokenA,
        isNative,
        amount,
        tokenB,
        pid,
        null
      );
    },
    [zapContract]
  );

  return { onZapForFarm: handleZap };
};

export default useZap;
