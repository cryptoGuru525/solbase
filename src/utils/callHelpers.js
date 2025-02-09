import { getMasterChefAddress } from "utils/addressHelpers";

import { didUserReject, fromReadableAmount } from "./customHelpers";
import { limitedFunction } from "./limitHelper";
import { notify } from "./toastHelper";

export const approve = async (
  lpContract,
  masterChefContract,
  address,
  isNFTPool
) => {
  return null;
};

export const stake = async (
  masterChefContract,
  pid,
  amount,
  decimals = 18,
  isNFTPool,
  isNFTALL
) => {
  console.log(amount, isNFTALL, pid, isNFTPool, "---stake---");
  try {
    const tx = await masterChefContract.deposit(
      pid,
      isNFTPool ? Number(amount) : fromReadableAmount(amount, decimals),
      isNFTALL
    );
    await tx.wait();
    notify("success", "Transaction successful!");
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
    }
    return null;
  }
};

export const unstake = async (
  masterChefContract,
  pid,
  amount,
  address,
  decimals = 18,
  isNFTPool,
  isNFTALL
) => {
  try {
    console.log(isNFTALL, "isNFT ALL");
    const tx = await masterChefContract.withdraw(
      pid,
      isNFTPool
        ? Number(amount).toString()
        : fromReadableAmount(amount, decimals),
      isNFTALL,
      { from: address }
    );
    await tx.wait();
    notify("success", "Transaction successful!");
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
    }
    return null;
  }
};

export const zap = async (
  zapContract,
  tokenA,
  isNative,
  amount,
  tokenB,
  isNativeOut,
  address
) => {
  try {
    if (isNative) {
      const tx = await zapContract.zapETH(tokenB, {
        from: address,
        value: amount,
      });
      await tx.wait();
      notify("success", "Zap successful!");
    } else {
      const tx = await zapContract.zap(tokenA, amount, tokenB, isNativeOut, {
        from: address,
      });
      await tx.wait();
      notify("success", "Zap successful!");
    }
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
      console.log(e);
    }
    return null;
  }
};

export const zapForFarm = async (
  zapContract,
  tokenA,
  isNative,
  amount,
  tokenB,
  pid,
  address
) => {
  try {
    const masterchefAddress = getMasterChefAddress();
    if (isNative) {
      const tx = await zapContract.zapIntoFarmWithETH(
        tokenB,
        masterchefAddress,
        pid,
        { from: address, value: amount }
      );
      await tx.wait();
      notify("success", "Transaction successful!");
    } else {
      console.log(tokenA, tokenB, amount, pid, masterchefAddress, address);
      const tx = await zapContract.zapIntoFarmWithToken(
        tokenA,
        amount,
        tokenB,
        masterchefAddress,
        pid,
        false,
        { from: address }
      );
      await tx.wait();
      return notify("success", "Transaction successful!");
    }
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
    }
    return null;
  }
};

export const harvest = async (masterChefContract, pid, address) => {
  const res = await limitedFunction(false, address);
  if (!res?.success) {
    notify("error", "You can not harvest or compound three times a day.");
    return false;
  }

  try {
    console.log(pid);
    const tx = await masterChefContract.deposit(pid, "0", false);
    await tx.wait();
    limitedFunction(true, address);
    notify("success", "Harvest successful!");
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
      console.log(e);
    }
    return null;
  }
};

export const harvestMany = async (masterChefContract, pids, address) => {
  const res = await limitedFunction(false, address);
  if (!res?.success) {
    notify("error", "You can not harvest or compound three times a day.");
    return false;
  }

  try {
    const tx = await masterChefContract.harvestMany(pids, {
      from: address,
    });
    await tx.wait();
    limitedFunction(true, address);
    notify("success", "Harvest All successful!");
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
    }
    return null;
  }
};

export const compound = async (masterChefContract, pid, address) => {
  const res = await limitedFunction(false, address);
  if (!res?.success) {
    notify("error", "You can not harvest or compound three times a day.");
    return false;
  }

  try {
    const tx = await masterChefContract.compound(pid);
    await tx.wait();
    limitedFunction(true, address);
    notify("success", "Harvest successful!");
  } catch (e) {
    if (didUserReject(e)) {
      notify("error", "User rejected transaction");
    } else {
      notify("error", e.reason);
      console.log(e);
    }
    return null;
  }
};
