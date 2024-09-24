import BigNumber from "bignumber.js";
import { BIG_ONE, BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import { filterFarmsByQuoteToken } from "utils/farmsPriceHelpers";
import { wildWethFarmPid, wethUsdcFarmPid } from "config";
const getFarmFromTokenSymbol = (farms, tokenSymbol, preferredQuoteTokens) => {
  const farmsWithTokenSymbol = farms.filter(
    (farm) => farm.token.symbol === tokenSymbol
  );
  const filteredFarm = filterFarmsByQuoteToken(
    farmsWithTokenSymbol,
    preferredQuoteTokens
  );
  return filteredFarm;
};

const getFarmBaseTokenPrice = (
  farm,
  quoteTokenFarm,
  wethPriceUsdt,
  bWildPriceUsdc
) => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote);
  if (["USDC", "MIM", "DAI"].includes(farm.quoteToken.symbol)) {
    return hasTokenPriceVsQuote
      ? new BigNumber(farm.tokenPriceVsQuote)
      : BIG_ZERO;
  }
  if (farm.quoteToken.symbol === "WETH") {
    return hasTokenPriceVsQuote
      ? wethPriceUsdt.times(farm.tokenPriceVsQuote)
      : BIG_ZERO;
  }
  if (farm.quoteToken.symbol === "BWiLD") {
    return hasTokenPriceVsQuote
      ? bWildPriceUsdc.times(farm.tokenPriceVsQuote)
      : BIG_ZERO;
  }

  // We can only calculate profits without a quoteTokenFarm for USDC/WBNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't USDC or wWBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - WBNB, (pBTC - WBNB)
  // from the WBNB - pBTC price, we can calculate the PNT - USDC price
  if (quoteTokenFarm.quoteToken.symbol === "WETH") {
    const quoteTokenInUsdc = wethPriceUsdt.times(
      quoteTokenFarm.tokenPriceVsQuote
    );
    return hasTokenPriceVsQuote && quoteTokenInUsdc
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsdc)
      : BIG_ZERO;
  }

  if (["USDC", "MIM", "DAI"].includes(quoteTokenFarm.quoteToken.symbol)) {
    const quoteTokenInUsdc = quoteTokenFarm.tokenPriceVsQuote;
    return hasTokenPriceVsQuote && quoteTokenInUsdc
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsdc)
      : BIG_ZERO;
  }

  // Catch in case token does not have immediate or once-removed WMATIC/USDC quoteToken
  return BIG_ZERO;
};

const getFarmQuoteTokenPrice = (
  farm,
  quoteTokenFarm,
  wethPriceUsdt,
  bWildPriceUsdc
) => {
  if (["USDC", "MIM", "DAI"].includes(farm.quoteToken.symbol)) {
    return BIG_ONE;
  }
  if (farm.quoteToken.symbol === "BWiLD") {
    return bWildPriceUsdc;
  }
  if (farm.quoteToken.symbol === "WETH") {
    return wethPriceUsdt;
  }
  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === "WETH") {
    return quoteTokenFarm.tokenPriceVsQuote
      ? wethPriceUsdt.times(quoteTokenFarm.tokenPriceVsQuote)
      : BIG_ZERO;
  }

  return BIG_ZERO;
};

const fetchFarmsPrices = async (farms) => {
  const wethUsdtFarm = farms.find((farm) => farm.pid === wethUsdcFarmPid);
  const wethPriceUsdt =
    wethUsdtFarm.tokenPriceVsQuote > 0
      ? BIG_ONE.div(wethUsdtFarm.tokenPriceVsQuote).times(BIG_TEN.pow(new BigNumber(12)))
      : BIG_ZERO;

  const bWildUsdtFarm = farms.find((farm) => farm.pid === wildWethFarmPid);
  const bWildPriceUsdc =
    bWildUsdtFarm.tokenPriceVsQuote > 0
      ? new BigNumber(bWildUsdtFarm.tokenPriceVsQuote).times(wethPriceUsdt)
      : BIG_ZERO;

  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(
      farms,
      farm.quoteToken.symbol
    );
    const baseTokenPrice = getFarmBaseTokenPrice(
      farm,
      quoteTokenFarm,
      wethPriceUsdt,
      bWildPriceUsdc
    );
    const quoteTokenPrice = getFarmQuoteTokenPrice(
      farm,
      quoteTokenFarm,
      wethPriceUsdt,
      bWildPriceUsdc
    );

    const token = { ...farm.token, usdcPrice: baseTokenPrice.toJSON() };
    const quoteToken = {
      ...farm.quoteToken,
      usdcPrice: quoteTokenPrice.toJSON(),
    };
    return { ...farm, token, quoteToken };
  });

  return farmsWithPrices;
};

export default fetchFarmsPrices;
