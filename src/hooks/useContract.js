import { useMemo } from "react";
import {
  getErc20Contract,
  getErc721Contract,
  getBWiLDContract,
  getMasterchefContract,
  getZapContract,
  getRouterContract,
  getFactoryContract,
  getNFTContract,
  getPresaleContract,
} from "utils/contractHelpers";
import { CHAIN_ID } from "config";
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address) => {
  const signer = null;
  return useMemo(() => getErc20Contract(address, signer), [address, signer]);
};
export const useERC721 = (address) => {
  const signer = null;
  return useMemo(() => getErc721Contract(address, signer), [address, signer]);
};

export const useBWiLD = () => {
  const provider = null;
  return useMemo(() => getBWiLDContract(provider, null), [provider]);
};

export const useMasterchef = () => {
  const signer = null;
  return useMemo(() => getMasterchefContract(signer, null), [signer]);
};

export const useZapContract = () => {
  const signer = null;
  return useMemo(() => getZapContract(signer, null), [signer]);
};

export const useFactoryContract = () => {
  const provider = null;
  return useMemo(() => getFactoryContract(provider, null), [provider]);
};

export const useRouterContract = () => {
  const signer = null;
  return useMemo(() => getRouterContract(signer, null), [signer]);
};

export const useNFTContract = () => {
  const signer = null;
  return useMemo(() => getNFTContract(signer), [signer]);
};

export const usePresaleContract = () => {
  const signer = null;
  return useMemo(() => getPresaleContract(signer), [signer]);
};
