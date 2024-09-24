import { base58 } from "@metaplex-foundation/umi/serializers";
import { notify } from "./toastHelper";
const detectBotTax = (logs) => {
  if (logs.find((l) => l.includes("Candy Guard Botting"))) {
    return true;
  }
  return false;
};

export const verifyTx = async (umi, signatures) => {
  const verifySignature = async (signature) => {
    console.log(base58.deserialize(signature));
    let transaction;
    for (let i = 0; i < 30; i++) {
      transaction = await umi.rpc.getTransaction(signature);
      if (transaction) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    if (!transaction) {
      return { success: false, reason: "No TX found" };
    }

    if (detectBotTax(transaction.meta.logs)) {
      return { success: false, reason: "Bot Tax detected!" };
    }

    return { success: true, mint: transaction.message.accounts[1] };
  };

  const stati = await Promise.all(signatures.map(verifySignature));
  let successful = [];
  let failed = [];
  stati.forEach((status) => {
    if (status.success === true) {
      successful.push(status.mint);
    } else {
      failed.push(status.reason);
    }
  });

  if (failed && failed.length > 0) {
    notify("error", `${failed.length} Mints failed!`);
    failed.forEach((fail) => {
      console.error(fail);
    });
  }

  if (successful.length > 0) {
    notify("success", `${successful.length} Mints successful!`);
  }

  return successful;
};
