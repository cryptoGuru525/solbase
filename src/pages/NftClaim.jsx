import { publicKey } from "@metaplex-foundation/umi";

import { useEffect, useMemo, useState } from "react";
import { useUmi } from "context/useUmi";
import {
  fetchCandyMachine,
  safeFetchCandyGuard,
  AccountVersion,
} from "@metaplex-foundation/mpl-candy-machine";
import { guardChecker } from "utils/checkAllowed";
import {
  Center,
  Card,
  CardHeader,
  CardBody,
  StackDivider,
  Heading,
  Stack,
  useToast,
  Text,
  Skeleton,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Image,
  ModalHeader,
  ModalOverlay,
  Box,
  Divider,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { ButtonList } from "components/NFTComponents/mintButton";
import { ShowNft } from "components/NFTComponents/showNft";
import { InitializeModal } from "components/NFTComponents/initializeModal";
import { image, headerText } from "config";
import { useSolanaTime } from "context/SolanaTimeContext";
import { REACT_PUBLIC_CANDY_MACHINE_ID } from "config";
import { CountDownComponent } from "components/CountDown";
const useCandyMachine = (
  umi,
  candyMachineId,
  checkEligibility,
  setCheckEligibility,
  firstRun,
  setfirstRun
) => {
  const [candyMachine, setCandyMachine] = useState();
  const [candyGuard, setCandyGuard] = useState();
  const toast = useToast();

  // useEffect(() => {
  //   (async () => {
  //     if (checkEligibility) {
  //       if (!candyMachineId) {
  //         console.error("No candy machine in .env!");
  //         if (!toast.isActive("no-cm")) {
  //           toast({
  //             id: "no-cm",
  //             title: "No candy machine in .env!",
  //             description: "Add your candy machine address to the .env file!",
  //             status: "error",
  //             duration: 999999,
  //             isClosable: true,
  //           });
  //         }
  //         return;
  //       }

  //       let candyMachine;
  //       try {
  //         candyMachine = await fetchCandyMachine(
  //           umi,
  //           publicKey(candyMachineId)
  //         );
  //         //verify CM Version
  //         if (candyMachine.version != AccountVersion.V2) {
  //           toast({
  //             id: "wrong-account-version",
  //             title: "Wrong candy machine account version!",
  //             description:
  //               "Please use latest sugar to create your candy machine. Need Account Version 2!",
  //             status: "error",
  //             duration: 999999,
  //             isClosable: true,
  //           });
  //           return;
  //         }
  //       } catch (e) {
  //         console.error(e);
  //         toast({
  //           id: "no-cm-found",
  //           title: "The CM from .env is invalid",
  //           description: "Are you using the correct environment?",
  //           status: "error",
  //           duration: 999999,
  //           isClosable: true,
  //         });
  //       }
  //       setCandyMachine(candyMachine);
  //       if (!candyMachine) {
  //         return;
  //       }
  //       let candyGuard;
  //       try {
  //         candyGuard = await safeFetchCandyGuard(
  //           umi,
  //           candyMachine.mintAuthority
  //         );
  //       } catch (e) {
  //         console.error(e);
  //         toast({
  //           id: "no-guard-found",
  //           title: "No Candy Guard found!",
  //           description: "Do you have one assigned?",
  //           status: "error",
  //           duration: 999999,
  //           isClosable: true,
  //         });
  //       }
  //       if (!candyGuard) {
  //         return;
  //       }
  //       setCandyGuard(candyGuard);
  //       if (firstRun) {
  //         setfirstRun(false);
  //       }
  //     }
  //   })();
  // }, [umi, checkEligibility]);

  return { candyMachine, candyGuard };
};

export default function NFTClaim() {
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const toast = useToast();
  const {
    isOpen: isShowNftOpen,
    onOpen: onShowNftOpen,
    onClose: onShowNftClose,
  } = useDisclosure();
  const {
    isOpen: isInitializerOpen,
    onOpen: onInitializerOpen,
    onClose: onInitializerClose,
  } = useDisclosure();
  const [mintsCreated, setMintsCreated] = useState();
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState();
  const [guards, setGuards] = useState([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [firstRun, setFirstRun] = useState(true);
  const [checkEligibility, setCheckEligibility] = useState(true);
  const [ended, setEnded] = useState(false);

  if (!REACT_PUBLIC_CANDY_MACHINE_ID) {
    console.error("No candy machine in .env!");
    if (!toast.isActive("no-cm")) {
      toast({
        id: "no-cm",
        title: "No candy machine in .env!",
        description: "Add your candy machine address to the .env file!",
        status: "error",
        duration: 999999,
        isClosable: true,
      });
    }
  }
  const candyMachineId = useMemo(() => {
    if (REACT_PUBLIC_CANDY_MACHINE_ID) {
      return publicKey(REACT_PUBLIC_CANDY_MACHINE_ID);
    } else {
      console.error(`NO CANDY MACHINE IN .env FILE DEFINED!`);
      toast({
        id: "no-cm",
        title: "No candy machine in .env!",
        description: "Add your candy machine address to the .env file!",
        status: "error",
        duration: 999999,
        isClosable: true,
      });
      return publicKey("11111111111111111111111111111111");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { candyMachine, candyGuard } = useCandyMachine(
    umi,
    candyMachineId,
    checkEligibility,
    setCheckEligibility,
    firstRun,
    setFirstRun
  );

  useEffect(() => {
    const checkEligibilityFunc = async () => {
      if (!candyMachine || !candyGuard || !checkEligibility || isShowNftOpen) {
        return;
      }
      setFirstRun(false);

      const { guardReturn, ownedTokens } = await guardChecker(
        umi,
        candyGuard,
        candyMachine,
        solanaTime
      );

      setOwnedTokens(ownedTokens);
      setGuards(guardReturn);
      setIsAllowed(false);

      let allowed = false;
      for (const guard of guardReturn) {
        if (guard.allowed) {
          allowed = true;
          break;
        }
      }

      setIsAllowed(allowed);
      setLoading(false);
    };

    checkEligibilityFunc();
    // On purpose: not check for candyMachine, candyGuard, solanaTime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility, firstRun]);

  const PageContent = () => {
    return (
      <div className="flex w-full justify-center items-center">
        <div className="flex flex-col justify-center items-center bg-secondary p-8 rounded-lg">
          <div className="flex flex-col items-center w-full">
            <div>
              <div className="font-semibold text-2xl">{headerText}</div>
            </div>
            {/* {loading ? (
              <></>
            ) : (
              <div className="flex flex-row w-full gap-4 items-center justify-center bg-primary mt-5 py-3 rounded-lg">
                <Text>Available NFTs:</Text>
                <Text fontWeight={"semibold"}>
                  {Number(candyMachine?.data.itemsAvailable) -
                    Number(candyMachine?.itemsRedeemed)}
                  / {Number(candyMachine?.data.itemsAvailable)}
                </Text>
              </div>
            )} */}
          </div>

          <div>
            <div className="flex justify-center rounded-lg mt-12 relative">
              <Image
                rounded={"lg"}
                height={400}
                width={400}
                objectFit={"cover"}
                alt={"project Image"}
                src={image}
              />
            </div>
            <Stack divider={<StackDivider />} spacing="8">
              <p className="text-center text-3xl font-bold shadow-md shadow-black/50 py-3 bg-secondary/40 rounded-md mb-2 backdrop-blur-sm">
                BiLL NFT SALE STARTS IN MAY 🚀
              </p>
              {/* <CountDownComponent endDate={1713348577000} setEnded={setEnded} /> */}

              {/* {loading ? (
                <div>
                  <Divider my="10px" />
                  <Skeleton height="30px" my="10px" />
                  <Skeleton height="30px" my="10px" />
                  <Skeleton height="30px" my="10px" />
                </div>
              ) : (
                <>
                </>
                // <ButtonList
                //   guardList={guards}
                //   candyMachine={candyMachine}
                //   candyGuard={candyGuard}
                //   umi={umi}
                //   ownedTokens={ownedTokens}
                //   setGuardList={setGuards}
                //   mintsCreated={mintsCreated}
                //   setMintsCreated={setMintsCreated}
                //   onOpen={onShowNftOpen}
                //   setCheckEligibility={setCheckEligibility}
                // />
              )} */}
            </Stack>
          </div>
        </div>
        {umi.identity.publicKey === candyMachine?.authority ? (
          <>
            <Center>
              <Button
                backgroundColor={"red.200"}
                marginTop={"10"}
                onClick={onInitializerOpen}
              >
                Initialize Everything!
              </Button>
            </Center>
            <Modal isOpen={isInitializerOpen} onClose={onInitializerClose}>
              <ModalOverlay />
              <ModalContent maxW="600px">
                <ModalHeader>Initializer</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <InitializeModal
                    umi={umi}
                    candyMachine={candyMachine}
                    candyGuard={candyGuard}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <></>
        )}

        <Modal isOpen={isShowNftOpen} onClose={onShowNftClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Your minted NFT:</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ShowNft nfts={mintsCreated} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    );
  };

  return <PageContent key="content" />;
}
