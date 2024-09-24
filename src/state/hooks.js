import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { orderBy } from "lodash";
import farmsConfig from "config/farms";
import { BIG_ZERO } from "utils/bigNumber";
import useRefresh from "hooks/useRefresh";
import { filterFarmsByQuoteToken } from "utils/farmsPriceHelpers";
import {
  fetchFarmsPublicDataAsync,
  // fetchBWiLDVaultPublicData,
  // fetchBWiLDVaultUserData,
  // fetchBWiLDVaultFees,
  setBlock,
} from "./actions";
import { nonArchivedFarms } from "./farms";
import { mainTokenSymbol, wethUsdcFarmPid } from "config";
import addresses from "constants/addresses";
export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const farmsToFetch = includeArchive ? farmsConfig : nonArchivedFarms;
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid);

    dispatch(fetchFarmsPublicDataAsync(pids));
  }, [includeArchive, dispatch, fastRefresh]);
};

/**
 * Fetches the "core" farm data used globally
 * 0 = BWiLD-ETH LP
 *
 */
export const usePollCoreFarmData = () => {
  const dispatch = useAppDispatch();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync([0]));
  }, [dispatch, fastRefresh]);
};

export const usePollBlockNumber = () => {
  const dispatch = useAppDispatch();
  const provider = null;
  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await provider.eth.getBlockNumber();
      dispatch(setBlock(blockNumber));
    }, 6000);

    return () => clearInterval(interval);
  }, [dispatch]);
};

// Farms

export const useFarms = () => {
  const farms = useSelector((state) => state.farms);
  return farms;
};

export const useFarmFromPid = (pid) => {
  const farm = useSelector((state) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromLpSymbol = (lpSymbol) => {
  const farm = useSelector((state) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);
  return {
    allowance: farm.userData
      ? farm.isNFTPool
        ? farm.userData.allowance
        : new BigNumber(farm.userData.allowance)
      : BIG_ZERO,
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : BIG_ZERO,
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  };
};

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol, preferredQuoteTokens) => {
  const farms = useSelector((state) =>
    state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol)
  );
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens);
  return filteredFarm;
};

// Return the base token price for a farm, from a given pid
export const useUSDCPriceFromPid = (pid) => {
  const farm = useFarmFromPid(pid);
  return farm && new BigNumber(farm.token.usdcPrice);
};

export const useUSDCPriceFromToken = (tokenSymbol) => {
  const tokenFarm = useFarmFromTokenSymbol(tokenSymbol);
  const tokenPrice = useUSDCPriceFromPid(tokenFarm?.pid);
  return tokenPrice;
};

export const useLpTokenPrice = (symbol) => {
  const farm = useFarmFromLpSymbol(symbol);
  const wethPrice = usePriceEthUsdc();
  const farmTokenPriceInUsd = usePriceBWiLDUsdc()[0];
  let lpTokenPrice = BIG_ZERO;
  const stables = ["USDC", "MIM", "DAI"];
  if (stables.includes(symbol)) return new BigNumber(1);

  if (symbol === "WETH") return wethPrice;
  if (farm.isTokenOnly) return farmTokenPriceInUsd;

  try {
    if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
      // Total value of base token in LP
      const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(
        farm.tokenBalanceLP
      );
      // Double it to get overall value in LP
      const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
      // Divide total value of all tokens, by the number of LP tokens
      lpTokenPrice = overallValueOfAllTokensInFarm.div(farm.lpTotalSupply);
    }
  } catch {}
  return lpTokenPrice;
};

// Pools

export const useFetchBWiLDVault = () => {
  // const { account } = useWeb3React()
  // const { fastRefresh } = useRefresh()
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(fetchBWiLDVaultPublicData())
  // }, [dispatch, fastRefresh])
  // useEffect(() => {
  //   dispatch(fetchBWiLDVaultUserData({ account }))
  // }, [dispatch, fastRefresh, account])
  // useEffect(() => {
  //   dispatch(fetchBWiLDVaultFees())
  // }, [dispatch])
};

export const useBWiLDVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalBWiLDInVault: totalBWiLDInVaultAsString,
    estimatedBWiLDBountyReward: estimatedBWiLDBountyRewardAsString,
    totalPendingBWiLDHarvest: totalPendingBWiLDHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      wildAtLastUserAction: wildAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state) => state.pools.wildVault);

  const estimatedBWiLDBountyReward = useMemo(() => {
    return new BigNumber(estimatedBWiLDBountyRewardAsString);
  }, [estimatedBWiLDBountyRewardAsString]);

  const totalPendingBWiLDHarvest = useMemo(() => {
    return new BigNumber(totalPendingBWiLDHarvestAsString);
  }, [totalPendingBWiLDHarvestAsString]);

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString);
  }, [totalSharesAsString]);

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString);
  }, [pricePerFullShareAsString]);

  const totalBWiLDInVault = useMemo(() => {
    return new BigNumber(totalBWiLDInVaultAsString);
  }, [totalBWiLDInVaultAsString]);

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString);
  }, [userSharesAsString]);

  const wildAtLastUserAction = useMemo(() => {
    return new BigNumber(wildAtLastUserActionAsString);
  }, [wildAtLastUserActionAsString]);

  return {
    totalShares,
    pricePerFullShare,
    totalBWiLDInVault,
    estimatedBWiLDBountyReward,
    totalPendingBWiLDHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      wildAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  };
};

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered } = useSelector(
    (state) => state.profile
  );
  return {
    profile: data,
    hasProfile: isInitialized && hasRegistered,
    isInitialized,
    isLoading,
  };
};

export const usePriceEthUsdc = () => {
  const ethUsdcFarm = useFarmFromPid(wethUsdcFarmPid);
  return new BigNumber(ethUsdcFarm.quoteToken.usdcPrice);
};

export const usePriceBWiLDUsdc = () => {
  // const wildEthFarm = useFarmFromPid(wildWethFarmPid)
  const [priceUsd, setPriceUsd] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const { fastRefresh } = useRefresh();
  // https://api.dexscreener.com/latest/dex/search?q=bWILD
  useEffect(() => {
    async function fetchData() {
      try {
        const returned = await (
          await fetch(
            `https://api.dexscreener.com/latest/dex/search?q=${mainTokenSymbol}`
          )
        ).json();

        if (returned && returned.pairs) {
          let data = returned.pairs[0];
          if (returned.pairs.length === 1) {
            data =
              returned.pairs[0].chainId === "base" &&
              returned.pairs[0].pairAddress === addresses.wildWethlp
                ? returned.pairs[0]
                : undefined;
          } else {
            data = returned.pairs.filter(
              (pair) =>
                pair.chainId == "base" &&
                pair.pairAddress == addresses.wildWethlp
            )[0];
          }
          setPriceUsd(data?.priceUsd);
          setLiquidity(data?.liquidity?.usd);
          setMarketCap(data?.fdv);
        }
      } catch {}
    }
    fetchData();
  }, []);
  if (priceUsd) return [new BigNumber(priceUsd), liquidity, marketCap];
  else return [new BigNumber(0), 0, 0];
};

// Block
export const useBlock = () => {
  return useSelector((state) => state.block);
};

export const useInitialBlock = () => {
  return useSelector((state) => state.block.initialBlock);
};

// Predictions
export const useIsHistoryPaneOpen = () => {
  return useSelector((state) => state.predictions.isHistoryPaneOpen);
};

export const useIsChartPaneOpen = () => {
  return useSelector((state) => state.predictions.isChartPaneOpen);
};

export const useGetRounds = () => {
  return useSelector((state) => state.predictions.rounds);
};

export const useGetSortedRounds = () => {
  const roundData = useGetRounds();
  return orderBy(Object.values(roundData), ["epoch"], ["asc"]);
};

export const useGetCurrentEpoch = () => {
  return useSelector((state) => state.predictions.currentEpoch);
};

export const useGetIntervalBlocks = () => {
  return useSelector((state) => state.predictions.intervalBlocks);
};

export const useGetBufferBlocks = () => {
  return useSelector((state) => state.predictions.bufferBlocks);
};

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks();
  const bufferBlocks = useGetBufferBlocks();
  return intervalBlocks + bufferBlocks;
};

export const useGetRound = (id) => {
  const rounds = useGetRounds();
  return rounds[id];
};

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch();
  const rounds = useGetSortedRounds();
  return rounds.find((round) => round.epoch === currentEpoch);
};

export const useGetPredictionsStatus = () => {
  return useSelector((state) => state.predictions.status);
};

export const useGetHistoryFilter = () => {
  return useSelector((state) => state.predictions.historyFilter);
};

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector((state) => state.predictions.currentRoundStartBlockNumber);
};

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector((state) => state.predictions.minBetAmount);
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount]);
};

export const useGetIsFetchingHistory = () => {
  return useSelector((state) => state.predictions.isFetchingHistory);
};

export const useGetHistory = () => {
  return useSelector((state) => state.predictions.history);
};

export const useGetHistoryByAccount = (account) => {
  const bets = useGetHistory();
  return bets ? bets[account] : [];
};

export const useGetBetByRoundId = (account, roundId) => {
  const bets = useSelector((state) => state.predictions.bets);

  if (!bets[account]) {
    return null;
  }

  if (!bets[account][roundId]) {
    return null;
  }

  return bets[account][roundId];
};

export const useGetLastOraclePrice = () => {
  const lastOraclePrice = useSelector(
    (state) => state.predictions.lastOraclePrice
  );
  return new BigNumber(lastOraclePrice);
};

export const useTotalValue = () => {
  const farms = useFarms();
  const wethPrice = usePriceEthUsdc();
  const wildPrice = usePriceBWiLDUsdc()[0];
  let value = new BigNumber(0);
  for (let i = 0; i < farms.data.length; i++) {
    const farm = farms.data[i];
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteToken.symbol === "WETH" && wethPrice) {
        val = wethPrice.times(farm.lpTotalInQuoteToken);
      } else if (farm.quoteToken.symbol === "BWiLD") {
        val = wildPrice.times(farm.lpTotalInQuoteToken);
      } else {
        val = new BigNumber(farm.lpTotalInQuoteToken);
      }
      value = value.plus(val);
    }
  }
  // return 1.0
  return parseFloat(value.toString());
};
