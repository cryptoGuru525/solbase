import React, { useEffect, useState, useCallback } from "react";
import {
  useModal,
  IconButton,
  AddIcon,
  MinusIcon,
  Skeleton,
  Text,
} from "uikit";
import { useLocation } from "react-router-dom";
import { BigNumber } from "bignumber.js";
import Balance from "components/Balance";
import { useFarmUser, useLpTokenPrice } from "state/hooks";
import { fetchFarmUserDataAsync } from "state/farms";
import { useTranslation } from "context/Localization";
import { useApprove } from "hooks/useApprove";
import { BASE_ADD_LIQUIDITY_URL } from "config";
import { useAppDispatch } from "state";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import {
  getBalanceAmount,
  getBalanceNumber,
  getFullDisplayBalance,
} from "utils/formatBalance";
import useStake from "hooks/useStake";
import useUnstake from "hooks/useUnstake";
import DepositModal from "../../DepositModal";
import WithdrawModal from "../../WithdrawModal";
import { ActionContainer, ActionTitles, ActionContent, Earned } from "./styles";
import { Tooltip } from "react-tooltip";
import {
  getErc20Contract,
  getErc721Contract,
  getMasterchefContract,
} from "utils/contractHelpers";
import { usePriceBWiLDUsdc } from "state/hooks";
import { toReadableAmount } from "utils/customHelpers";

const StakedAction = ({
  isTokenOnly,
  isNFTPool,
  pid,
  lpSymbol,
  lpAddresses,
  quoteToken,
  token,
  userDataReady,
  withDepositLockDiscount,
  depositFee,
  userData,
}) => {
  const [amountPerNFT, setAmountPerNFT] = useState();
  const [isNFTALL, setIsNFTALL] = useState(false);
  const { t } = useTranslation();
  const signer = null;
  const [requestedApproval, setRequestedApproval] = useState(false);
  const {
    allowance,
    tokenBalance: tokenBalanceAsString,
    stakedBalance: stakedBalanceAsString,
  } = useFarmUser(pid);
  const wildPrice = usePriceBWiLDUsdc()[0];

  const masterChefContract = getMasterchefContract(signer);

  const decimals = isTokenOnly ? token.decimals : 18;
  const tokenBalance = new BigNumber(tokenBalanceAsString).times(
    new BigNumber(10).pow(18 - decimals)
  );
  const stakedBalance = new BigNumber(stakedBalanceAsString).times(
    new BigNumber(10).pow(18 - decimals)
  );
  const { onStake } = useStake(pid, isNFTPool);
  const { onUnstake } = useUnstake(pid, isNFTPool);
  const location = useLocation();
  const lpPrice = useLpTokenPrice(lpSymbol);

  const isApproved = isNFTPool
    ? null && allowance[0]
    : null && allowance && allowance.isGreaterThan(0);

  const lpAddress = isTokenOnly ? token.address : lpAddresses;
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: quoteToken.address,
    tokenAddress: token.address,
  });
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;

  const handleStake = async (amount, daysToLock) => {
    try {
      if (!isApproved) await handleApprove();
      console.log("amount...", amount);
      await onStake(amount, isNFTALL);
      dispatch(fetchFarmUserDataAsync({ account: null, pids: [pid] }));
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnstake = async (amount) => {
    try {
      console.log("is unstaking...");
      await onUnstake(amount, isNFTALL);
      dispatch(fetchFarmUserDataAsync({ account: null, pids: [pid] }));
    } catch (e) {
      console.log(e);
    }
  };

  const displayBalance = useCallback(() => {
    if (isNFTPool) {
      return stakedBalance.toString();
    } else {
      const stakedBalanceBigNumber = getBalanceAmount(stakedBalance);
      if (stakedBalanceBigNumber.gt(0) && stakedBalanceBigNumber.lt(0.0001)) {
        return getFullDisplayBalance(stakedBalance, 18, 4).toLocaleString();
      }
      return stakedBalanceBigNumber.toFixed(4, BigNumber.ROUND_DOWN);
    }
  }, [stakedBalance]);

  const _depositFee = depositFee;

  const [onPresentDeposit] = useModal(
    <DepositModal
      pid={pid}
      isNFTPool={isNFTPool}
      isNFTALL={isNFTALL}
      setIsNFTALL={setIsNFTALL}
      account={null}
      max={tokenBalance}
      onConfirm={handleStake}
      tokenName={lpSymbol}
      addLiquidityUrl={BASE_ADD_LIQUIDITY_URL}
      withDepositLockDiscount={withDepositLockDiscount}
      depositFee={_depositFee}
      unlockTime={userData.unlockTime}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      isNFTPool={isNFTPool}
      isNFTALL={isNFTALL}
      setIsNFTALL={setIsNFTALL}
      max={stakedBalance}
      onConfirm={handleUnstake}
      tokenName={lpSymbol}
    />
  );
  const lpContract = isNFTPool
    ? getErc721Contract(lpAddress, signer)
    : getErc20Contract(lpAddress, signer);
  const dispatch = useAppDispatch();
  const { onApprove } = useApprove(lpContract, isNFTPool);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      dispatch(fetchFarmUserDataAsync({ account: null, pids: [pid] }));

      setRequestedApproval(false);
    } catch (e) {
      console.log(e);
    }
  }, [onApprove, dispatch, pid]);

  const getAmountPerNFT = async () => {
    const _amountPerNFT = await masterChefContract.getAmountPerNFT();
    setAmountPerNFT(toReadableAmount(_amountPerNFT.toString()));
  };
  useEffect(() => {
    if (signer) {
      getAmountPerNFT();
    }
  }, [signer]);

  if (!null) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text color="white" fontSize="20px">
            {t("Start Farming")}
          </Text>
        </ActionTitles>
        <ActionContent>Unlock</ActionContent>
      </ActionContainer>
    );
  }

  if (!userDataReady) {
    return (
      <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-4 p-2 lg:p-4 w-full">
        <div className="flex justify-center font-semibold text-xl w-full">
          {t("Start Farming")}
        </div>
        <div className="flex w-full justify-center">
          <Skeleton width={180} marginBottom={28} marginTop={14} />
        </div>
      </div>
    );
  }

  if (stakedBalance.gt(0)) {
    return (
      <div className="flex flex-row items-center justify-between md:justify-end gap-5 p-2 lg:p-4 w-full">
        <div className="flex flex-col gap-1 justify-between md:min-w-[200px]">
          <div className="text-lg font-semibold">
            {lpSymbol}
            &nbsp;
            {t("Staked")}
          </div>
          <Earned>{displayBalance()}</Earned>
          {stakedBalance.gt(0) && lpPrice.gt(0) && (
            <Balance
              fontSize="15px"
              color="white"
              decimals={2}
              value={
                isNFTPool
                  ? stakedBalance
                      .times(new BigNumber(amountPerNFT))
                      .times(wildPrice)
                  : getBalanceNumber(lpPrice.times(stakedBalance))
              }
              unit=" USD"
              prefix="~"
            />
          )}
        </div>
        <div className="flex flex-row items-center">
          <IconButton
            variant="secondary"
            data-tooltip-id="unstake-tooltip"
            data-tooltip-content="Unstake Pool"
            onClick={() => {
              setIsNFTALL(false);
              onPresentWithdraw();
            }}
            mr="6px"
          >
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton
            variant="secondary"
            data-tooltip-id="stake-tooltip"
            data-tooltip-content="Stake pool"
            onClick={() => {
              setIsNFTALL(false);
              onPresentDeposit();
            }}
            disabled={["history", "archived"].some((item) =>
              location.pathname.includes(item)
            )}
          >
            <AddIcon color="primary" width="14px" />
          </IconButton>
          <Tooltip id="unstake-tooltip" />
          <Tooltip id="stake-tooltip" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-4 p-2 lg:p-4 w-full">
      <div className="flex justify-center font-semibold text-xl w-full">
        {t("Stake").toUpperCase()} {lpSymbol}
      </div>
      <div className="flex w-full justify-center">
        <button
          onClick={onPresentDeposit}
          disabled={["history", "archived"].some((item) =>
            location.pathname.includes(item)
          )}
          className="rounded-md p-1  text-center text-white font-medium base_bg max-w-[200px] w-full hover:bg-symbolHover hover:text-white transition ease-in-out duration-300 hover:scale-105"
        >
          {t("Stake")}
        </button>
      </div>
    </div>
  );
};

export default StakedAction;
