import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Text, Button, Input, Link } from "uikit";
import { useTranslation } from "context/Localization";
import { BigNumber } from "bignumber.js";
import { getMasterchefContract, getNFTContract } from "utils/contractHelpers";

const StyledInput = styled(Input)`
  box-shadow: none;
  flex: 1;
  padding: 0 8px;
  color: black;

  @media screen and (min-width: 370px) {
    width: 80px;
  }

  @media screen and (min-width: 576px) {
    width: auto;
  }
`;

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`;

const ModalInput = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
  isNFTPool,
  decimals = 18,
}) => {
  const [userBalance, setUserBalance] = useState("");
  const signer = null;
  const { t } = useTranslation();
  const isBalanceZero = max === "0" || !max;

  const displayBalance = async (balance) => {
    const nftContract = getNFTContract(signer);
    const masterChefContract = getMasterchefContract(signer);

    if (isBalanceZero) {
      setUserBalance("0");
    }
    if (isNFTPool) {
      let tokenIds;
      if (inputTitle === "Stake") {
        tokenIds = await nftContract.walletOfOwner(null);
      } else {
        tokenIds = await masterChefContract.getUserStakedNFTs(6, null);
      }
      setUserBalance(balance);
      // setUserBalance(
      //   balance + " : [ " + removeLeadingZeros(tokenIds).toString() + " ]"
      // );
    } else {
      const balanceBigNumber = new BigNumber(balance);
      if (balanceBigNumber.gt(0) && balanceBigNumber.lt(0.0001)) {
        setUserBalance(balanceBigNumber.toLocaleString());
      }
      setUserBalance(balanceBigNumber.toFixed(3, BigNumber.ROUND_DOWN));
    }
  };

  useEffect(() => {
    if (null && signer) displayBalance(max);
  }, [signer, max]);

  return (
    <div className="relative">
      <div className="flex items-center flex-col">
        <div className="flex flex-row justify-between pb-3 w-full">
          <div>
            <Text fontSize="15px" color="textWhite">
              {inputTitle}
            </Text>
          </div>
          <div>
            <Text fontSize="15px" color="textWhite">
              {t("Balance: %balance%", { balance: userBalance })}
            </Text>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full gap-3 py-3">
          <StyledInput
            pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder={isNFTPool ? "amount of NFT(s)" : "0"}
            value={value}
          />
          <button
            scale="sm"
            onClick={onSelectMax}
            mr="8px"
            className="main_btn w-24"
          >
            {t("Max")}
          </button>

          <Text fontSize="16px" color="textWhite">
            {symbol}
          </Text>
        </div>
      </div>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          {t("No tokens to stake")}:{" "}
          <Link fontSize="14px" href={addLiquidityUrl} external color="failure">
            {t("Get %symbol%", { symbol })}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  );
};

export default ModalInput;
