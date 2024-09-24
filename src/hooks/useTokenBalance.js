import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import {
  getErc20Contract,
  getBWiLDContract,
  getMasterchefContract,
} from "utils/contractHelpers";
import { BIG_ZERO } from "utils/bigNumber";
import useRefresh from "./useRefresh";
import useLastUpdated from "./useLastUpdated";
import { CHAIN_ID } from "config";
import { toReadableAmount } from "utils/customHelpers";
const FetchStatus = {
  NOT_FETCHED: "not-fetched",
  SUCCESS: "success",
  FAILED: "failed",
};

const useTokenBalance = (tokenAddress) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus;
  const [balanceState, setBalanceState] = useState({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  });
  const { fastRefresh } = useRefresh();
  const provider = null;
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const contract = getErc20Contract(tokenAddress, provider);
        const res = await contract.balanceOf(null);
        setBalanceState({ balance: res, fetchStatus: SUCCESS });
      } catch (e) {
        console.log(e);
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }));
      }
    };

    if (provider) {
      fetchBalance();
    }
  }, [tokenAddress, fastRefresh, SUCCESS, FAILED, provider]);

  return balanceState;
};

export const useTotalSupply = () => {
  const { fastRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState(0);
  const provider = null;
  useEffect(() => {
    setTotalSupply(9999);
  }, []);

  return totalSupply;
};

export const useBWiLDPerSecond = () => {
  const { fastRefresh } = useRefresh();
  const [bWildPerSecond, setWildPerSecond] = useState(BIG_ZERO);
  const provider = null;

  useEffect(() => {
    async function fetchWildPerSecond() {
      try {
        const masterChefContract = getMasterchefContract(provider);
        const perSecond = await masterChefContract.bWildPerSecond();
        setWildPerSecond(toReadableAmount(perSecond, 18, 5));
      } catch (e) {
        console.log(e);
      }
    }
    if (provider) fetchWildPerSecond();
  }, [provider]);

  return bWildPerSecond;
};

export const useBurnedBalance = (tokenAddress) => {
  const [balance, setBalance] = useState(BIG_ZERO);
  const { fastRefresh } = useRefresh();
  const provider = null;

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getErc20Contract(tokenAddress, provider);
      const res = await contract.balanceOf(
        "0x0000000000000000000000000000000000000000dEaD"
      );
      setBalance(new BigNumber(res));
    };

    fetchBalance();
  }, [tokenAddress, fastRefresh]);

  return balance;
};

export const useBWiLDBurnedBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO);
  const { fastRefresh } = useRefresh();
  const provider = null;
  useEffect(() => {
    const fetchBalance = async () => {
      const wildContract = getBWiLDContract(provider, CHAIN_ID);
      const res = await wildContract.totalFees();
      setBalance(new BigNumber(res).div(new BigNumber(3))); // 1/3 of total fees are burning
    };

    fetchBalance();
  }, []);

  return balance;
};

export const useGetBnbBalance = () => {
  const [balance, setBalance] = useState(BIG_ZERO);
  const { lastUpdated, setLastUpdated } = useLastUpdated();
  const provider = null;

  useEffect(() => {
    const fetchBalance = async () => {
      const walletBalance = await provider.getBalance(null);
      setBalance(new BigNumber(walletBalance));
    };
  }, [provider, lastUpdated, setBalance]);

  return { balance, refresh: setLastUpdated };
};

export default useTokenBalance;
