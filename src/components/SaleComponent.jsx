import React, { useEffect, useState } from "react";
import { didUserReject } from "utils/customHelpers";
import { notify } from "utils/toastHelper";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { storedb } from "services/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
} from "@chakra-ui/react";
import { toFixed } from "utils/customHelpers";

import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const presalePrice = 0.003;
const recipientKey = "Bq338uM27iVo9XeJN3jsosrL4UoxPGZQ4EfMtmoh18UL";

export default function SaleComponent() {
  const [balance, setBalance] = useState("0");
  const [tokenAmount, setTokenAmount] = useState("0");
  const [plegged, setPlegged] = useState(0);
  const [txSig, setTxSig] = useState("");

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [sliderValue, setSliderValue] = useState(0);

  const handleSlideChange = (val) => {
    setTokenAmount(toFixed(Number(val) / presalePrice, 4));
  };
  const handleTokenAmountChange = (e) => {
    if (Number(e.target.value) * presalePrice > balance) {
      notify("warning", "Insufficient Balance");
      return;
    }
    setTokenAmount(e.target.value);

    setSliderValue(toFixed(Number(e.target.value) * presalePrice, 4));
  };

  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      setBalance(info.lamports / LAMPORTS_PER_SOL);
    });
  }, [connection, publicKey]);

  useEffect(() => {
    async function getHistory(address) {
      const q = query(
        collection(storedb, "presales"),
        where("address", "==", address)
      );

      const querySnapshot = await getDocs(q);
      let depositedAmount = 0;
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        if (data.sol_amount !== undefined) {
          depositedAmount += Number(data.sol_amount);
        }
      });
      setPlegged(depositedAmount);
    }
    if (publicKey) getHistory(publicKey.toString());
  }, [publicKey]);

  useEffect(() => {
    async function getBalance() {
      const balance = await connection.getBalance(publicKey);
      //So we convert it to SOL
      const solBalance = balance / LAMPORTS_PER_SOL;
      setBalance(solBalance);
    }
    if (publicKey) getBalance();
  }, [publicKey, connection]);

  const handleBuyWild = (event) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    try {
      if (Number(sliderValue) <= 0) {
        notify("warning", "Please set SOL amount to deposit!");
        return;
      }
      const transaction = new web3.Transaction();

      const recipientPubKey = new web3.PublicKey(recipientKey);
      console.log(recipientPubKey);

      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: LAMPORTS_PER_SOL * sliderValue,
      });

      console.log(sendSolInstruction);
      transaction.add(sendSolInstruction);
      console.log(transaction);

      sendTransaction(transaction, connection).then(async (sig) => {
        setTxSig(sig);
        try {
          // Add a new document with a generated id.
          const docRef = await addDoc(collection(storedb, "presales"), {
            address: publicKey.toString(),
            token_amount: tokenAmount,
            sol_amount: sliderValue,
            purchase_date: Date.now(),
            txHash: txSig,
          });
          console.log("Presale recorded with ID: ", docRef.id);

          notify(
            "success",
            `You deposited ${sliderValue} SOL for ${tokenAmount} BiLLs successfully`
          );
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
      if (didUserReject(error)) {
        notify("warning", "User Rejected transaction");
        return;
      } else {
        notify("warning", error.reason);
        return;
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 ">
      <div className="balance_form">
        {/* <p className="text-center text-lg font-semibold">Presale is now until timer expires.</p> */}
        <div className="mb-8">
          <div className="flex flex-col justify-center items-center w-70 p-4">
            <span className="font-semibold text-lg">UP TO 3% DAILY APR</span>
            <img src="/assets/presale.webp" alt="Presale" className="w-60" />
          </div>
          <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
            <div> Presale Price:</div>
            <div>
              <p className="flex gap-1">
                <span className={"font-semibold text-green-500"}>
                  {presalePrice} SOL
                </span>
              </p>
            </div>
          </div>
          <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
            <div> Launch Price:</div>
            <div>
              <p className="flex gap-1">
                <span className={"font-semibold text-green-500"}>
                  0.006 SOL
                </span>
              </p>
            </div>
          </div>
          <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
            <div> Your SOL Deposited:</div>
            <div className={"font-semibold text-green-500"}>
              {toFixed(plegged, 4)} SOL
            </div>
          </div>
          <div className="flex justify-between mb-3 border-b border-symbolBorder px-1">
            <div> Your SOL Balance:</div>
            <div className={"font-semibold text-green-500"}>
              {toFixed(balance, 4)} SOL
            </div>
          </div>
        </div>
        <div>
          <div> SOL Amount to Deposit:</div>
          <Box p={4} pt={6} mt={3}>
            <Slider
              aria-label="slider-ex-6"
              defaultValue={Number(toFixed(Number(balance) / 2, 4))}
              min={0}
              max={Number(toFixed(balance, 4))}
              step={0.001}
              onChange={(val) => setSliderValue(val)}
              onChangeEnd={(val) => handleSlideChange(val)}
            >
              <SliderMark
                value={sliderValue}
                textAlign="center"
                bg="blue.500"
                color="white"
                mt="-10"
                mb="10"
                ml="-5"
                w="32"
              >
                {sliderValue} SOL
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        </div>
        <div className="flex justify-between items-center mb-3 border-b border-symbolBorder p-2">
          <div> Estimated Purchase Amount:</div>
          <div className="flex item-center justify-center gap-1">
            <div>
              <input
                type="text"
                name=""
                id=""
                value={tokenAmount}
                onChange={(e) => handleTokenAmountChange(e)}
                className="bg-transparent text-xs rounded-md font-semibold text-green-500"
              />
            </div>
            <div className={"font-semibold text-green-500 mt-1"}>BiLL</div>
          </div>
        </div>
      </div>
      <button className="main_btn base_bg w-full my-2" onClick={handleBuyWild}>
        BUY BiLL
      </button>
    </div>
  );
}
