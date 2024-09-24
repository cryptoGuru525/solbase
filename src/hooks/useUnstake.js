import { useCallback } from "react";
import { unstake } from "utils/callHelpers";
import { useFarmFromPid } from "state/hooks";
import { useMasterchef } from "./useContract";
const useUnstake = (pid, isNFTPool) => {
  const masterChefContract = useMasterchef();
  const farm = useFarmFromPid(pid);

  const tokenDecimals = farm.isTokenOnly ? farm.token.decimals : 18;

  const handleUnstake = useCallback(
    async (amount, isNFTALL) => {
      await unstake(
        masterChefContract,
        pid,
        amount,
        null,
        tokenDecimals,
        isNFTPool,
        isNFTALL
      );
    },
    [masterChefContract, pid, tokenDecimals, isNFTPool]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
