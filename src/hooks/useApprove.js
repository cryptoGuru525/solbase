import { useCallback } from "react";
import { approve } from "utils/callHelpers";
import { useMasterchef } from "./useContract";
// Approve a Farm
export const useApprove = (lpContract, isNFTPool) => {
  const masterChefContract = useMasterchef();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, null, isNFTPool);
      await tx.wait();
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

export default useApprove;
