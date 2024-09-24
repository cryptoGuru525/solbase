import { useCallback } from "react";
import { harvest } from "utils/callHelpers";
import { useMasterchef } from "./useContract";

export const useHarvest = (farmPid) => {
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    return await harvest(masterChefContract, farmPid, null);
  }, [farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};
