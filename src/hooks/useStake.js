import { useCallback } from "react";
import { useFarmFromPid } from "state/hooks";
import { stake } from "utils/callHelpers";
import { useMasterchef } from "./useContract";

const useStake = (pid, isNFTPool) => {
  const masterChefContract = useMasterchef();
  const farm = useFarmFromPid(pid);

  const tokenDecimals = farm.isTokenOnly ? farm.token.decimals : 18;
  const handleStake = useCallback(
    async (amount, isNFTALL) => {
      // const whitelistMerkleTree = StandardMerkleTree.of(
      //   merkleTree.values.map((item) => item.value),
      //   merkleTree.leafEncoding,
      // )
      const proof = [];
      // try {
      //   proof = whitelistMerkleTree.getProof([account])
      // } catch (e) {
      //  console.log('Whitelist check error', e)
      // }
      await stake(
        masterChefContract,
        pid,
        amount,
        tokenDecimals,
        isNFTPool,
        isNFTALL
      );
    },
    [masterChefContract, pid, tokenDecimals, isNFTPool]
  );

  return { onStake: handleStake };
};

export default useStake;
