import * as React from "react";

export function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = null;
  const signer = provider.getSigner(account.address);
  return signer;
}
