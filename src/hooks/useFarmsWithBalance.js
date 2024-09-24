import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import multicall from "utils/multicall";
import { getMasterChefAddress } from "utils/addressHelpers";
import masterChefABI from "config/abis/masterchef.json";
import farmsConfig from "config/farms";
import useRefresh from "./useRefresh";

export const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState([]);
  const { fastRefresh } = useRefresh();
  const signer = null;

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig
        .filter((farm) => farm.pid || farm.pid === 0)
        .map((farm) => ({
          address: getMasterChefAddress(),
          name: "pendingBWild",
          params: [farm.pid],
        }));
      try {
        const rawResults = await multicall(masterChefABI, calls);
        const results = farmsConfig.map((farm, index) => ({
          ...farm,
          balance: new BigNumber(rawResults[index]),
        }));
        setFarmsWithBalances(results);
      } catch (e) {
        console.log("Fetch Farms With Balance Error:", e);
      }
    };

    if (signer) {
      fetchBalances();
    }
  }, [signer]);

  return farmsWithBalances;
};
