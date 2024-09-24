import { fetchToken } from "@metaplex-foundation/mpl-toolbox";
import { createStandaloneToast } from "@chakra-ui/react";

export const checkAtaValid = (umi, guards) => {
  console.log("checkAtaValid");
  let atas = [];
  guards.forEach((guard) => {
    if (guard.guards.tokenPayment.__option === "Some") {
      let tokenPayment = guard.guards.tokenPayment;
      atas.push(tokenPayment.value.destinationAta);
    }
    if (guard.guards.freezeTokenPayment.__option === "Some") {
      let freezeTokenPayment = guard.guards.freezeTokenPayment;
      atas.push(freezeTokenPayment.value.destinationAta);
    }
  });
  atas.forEach((ata) => {
    fetchToken(umi, ata).catch((e) => {
      console.log(e);
      createStandaloneToast().toast({
        title: "Your Candy Guard config is incorrect!",
        description: `${ata} is not a Associated Token Account! Minting will fail!`,
        status: "error",
        duration: 9000,
        isClosable: false,
      });
    });
  });
  return;
};
