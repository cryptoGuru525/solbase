import lpTokenAbi from "config/abis/lpToken.json";
import { toReadableAmount } from "./customHelpers";

export async function getBalance(address, token, provider) {
  if (!token || !address || !provider) return;
  try {
    if (token.lpSymbol === "ETH") {
      const balance = await provider?.getBalance(address);
      return toReadableAmount(balance, 18);
    } else {
      return 0;
    }
  } catch (e) {
    console.log(e);
  }
}
