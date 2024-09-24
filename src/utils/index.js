import { toReadableAmount } from "./customHelpers";
export function fromReadableAmount(amount, decimals) {
  if (!amount) return 0;
}

export const getValidPair = async (tokenA, tokenB, contract) => {
  try {
    const pair = await contract.getPair(tokenA, tokenB);
    if (pair !== "0x0000000000000000000000000000000000000000") {
      return pair;
    } else {
      return "";
    }
  } catch (e) {
    console.log(e.reason);
  }
};

export const getAllowance = async (
  address,
  token,
  router_address,
  provider
) => {
  if (address && token && provider) {
    try {
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
};

export const getPrice = async (tokenA, tokenB, amount, where, contract) => {
  const amount_in = fromReadableAmount(amount, tokenA.decimals);
  try {
    const amount_out = await contract.getAmountsOut(amount_in, [
      tokenA?.address,
      tokenB?.address,
    ]);
    return toReadableAmount(amount_out[1], tokenA.decimals);
  } catch (e) {
    console.log(e);
    return "unkown";
  }
};

export const approveHandler = async (token, amount_in, signer) => {};

export const createPair = async (addressA, addressB, contract) => {
  try {
    const newPair = await contract.createPair(addressA, addressB);
    return newPair;
  } catch (e) {
    console.log(e);
    return false;
  }
};
