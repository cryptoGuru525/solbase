import { useCallback } from "react";
import { compound } from "utils/callHelpers";
import { useMasterchef } from "./useContract";

export const useCompound = (farmPid) => {
  const masterChefContract = useMasterchef();

  const handleCompound = useCallback(async () => {
    return await compound(masterChefContract, farmPid, null);
  }, [farmPid, masterChefContract]);

  return { onCompound: handleCompound };
};
