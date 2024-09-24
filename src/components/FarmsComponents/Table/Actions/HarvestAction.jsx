import React, { useState, useEffect } from "react";
import { Skeleton } from "uikit";
import BigNumber from "bignumber.js";
import Balance from "components/Balance";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceAmount } from "utils/formatBalance";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { usePriceBWiLDUsdc } from "state/hooks";
import { useHarvest } from "hooks/useHarvest";
import { useTranslation } from "context/Localization";
import { Earned } from "./styles";
import { Tooltip } from "react-tooltip";
import Loading from "components/Loading";
import { notify } from "utils/toastHelper";
import ZapInModal from "components/ZapInModal";
import CompoundModal from "components/CompoundModal";
import { didUserReject } from "utils/customHelpers";
import LogoLoading from "components/LogoLoading";

const HarvestAction = ({ pid, userData, userDataReady, isNFTPool }) => {
  const [pendingCompoundTx, setCompoundPendingTx] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const [earnings, setEarnings] = useState(BIG_ZERO);
  const [earningsUsdt, setEarningsUsdt] = useState(0);
  const [open, setOpen] = useState(false);
  const [openCompound, setOpenCompound] = useState(false);
  const [displayBalance, setDisplayBalance] = useState(
    userDataReady ? earnings.toLocaleString() : <Skeleton width={60} />
  );
  const { onReward } = useHarvest(pid);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const wildPrice = usePriceBWiLDUsdc()[0];

  useEffect(() => {
    const earningsBigNumber = new BigNumber(userData.earnings);
    // If user didn't connect wallet default balance will be 0
    if (!earningsBigNumber.isZero()) {
      setEarnings(getBalanceAmount(earningsBigNumber));
      setEarningsUsdt(earnings.multipliedBy(wildPrice).toNumber());
      setDisplayBalance(earnings.toFixed(3, BigNumber.ROUND_DOWN));
    }
  }, [userData.earnings, userDataReady]);

  async function handleHavest() {
    try {
      setPendingTx(true);
      const res = await onReward(false);
      console.log("harvest", res);
      if (res === false) {
        setPendingTx(false);
        return;
      }
      dispatch(fetchFarmUserDataAsync({ account: null, pids: [pid] }));
      setPendingTx(false);
    } catch (e) {
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setPendingTx(false);
    }
  }

  // async function handleCompound() {
  //   try {
  //     setCompoundPendingTx(true)
  //     await harvestMany(masterChefContract, [pid], true, address)
  //     notify('success', 'You have successfully claimed BWiLD tokens')
  //     dispatch(fetchFarmUserDataAsync({ address, pids: [pid] }))
  //     setCompoundPendingTx(false)
  //   } catch (e) {
  //     if (didUserReject(e)) {
  //       notify('error', 'User rejected transaction')
  //     }
  //     setCompoundPendingTx(false)
  //   }
  // }

  function openCompoundModal() {
    console.log(pid);
    setOpenCompound(true);
  }
  function closeCompoundModal() {
    setOpenCompound(false);
  }
  function openModal() {
    console.log(pid);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  return (
    <div className="flex flex-row items-center  justify-between md:justify-around gap-4  p-2 lg:p-4 w-full">
      <div className="flex flex-col justify-between gap-2 w-full">
        <div className="text-white text-md font-semibold">
          BiLL &nbsp;
          {t("Earned")}
        </div>
        <Earned>{displayBalance}</Earned>
        {earningsUsdt > 0 && (
          <Balance
            fontSize="14px"
            color="white"
            decimals={2}
            value={earningsUsdt}
            unit=" USD"
            prefix="~"
          />
        )}
      </div>
      <div className="flex flex-col justify-center gap-2 lg:min-w-[200px] min-w-[130px]">
        <button
          disabled={earnings.eq(0) || pendingTx || !userDataReady}
          onClick={handleHavest}
          className="rounded-md p-1  text-center text-white font-medium base_bg duration-300 hover:text-white hover:bg-symbolHover transition ease-in-out hover:scale-105"
        >
          {t(`Harvest`)}
        </button>

        <div className="flex flex-col lg:flex-row gap-1 w-full">
          {!isNFTPool && (
            <>
              <button
                className="rounded-md w-full lg:w-1/2 px-2 py-1  text-center text-white font-medium duration-300 hover:text-white transition ease-in-out hover:scale-105  base_bg hover:bg-symbolHover"
                data-tooltip-id="compound-tooltip"
                data-tooltip-content={
                  earnings.eq(0) || pendingCompoundTx || !userDataReady
                    ? "Stake tokens first to use it"
                    : "Restake your BiLL profit to BiLL pool"
                }
                disabled={earnings.eq(0) || pendingCompoundTx || !userDataReady}
                onClick={openCompoundModal}
              >
                {t(`Compound`)}
              </button>
              <button
                className="rounded-md w-full px-2 py-1 text-white text-center font-medium duration-300 hover:text-white transition ease-in-out hover:scale-105  base_bg hover:bg-symbolHover"
                data-tooltip-id="zap-tooltip"
                data-tooltip-content="Stake to this pool from your wallet"
                disabled={!userDataReady}
              >
                {t("Zap in")}
              </button>
            </>
          )}

          <Tooltip id="compound-tooltip" />
          <Tooltip id="zap-tooltip" />
        </div>
      </div>
      {open && <ZapInModal open={open} closeModal={closeModal} pid={pid} />}
      {openCompound && (
        <CompoundModal
          open={openCompound}
          closeModal={closeCompoundModal}
          earnings={earnings}
          pid={[pid]}
          isAll={false}
        />
      )}

      {pendingTx && <LogoLoading title="Harvesting..." />}
      {pendingCompoundTx && <Loading title="Compounding..." />}
    </div>
  );
};

export default HarvestAction;
