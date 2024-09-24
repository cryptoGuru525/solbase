import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { RefreshContextProvider } from "context/RefreshContext";
import { ThemeContextProvider } from "context/ThemeContext";
import { LanguageProvider } from "context/Localization";
import { ModalProvider } from "uikit";

import store from "state";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  MathWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { SolanaTimeProvider } from "context/SolanaTimeContext";
import { UmiProvider } from "utils/UmiProvider";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const Providers = ({ children }) => {
  let network = WalletAdapterNetwork.Mainnet;
  if (
    process.env.REACT_PUBLIC_ENVIRONMENT === "mainnet-beta" ||
    process.env.REACT_PUBLIC_ENVIRONMENT === "mainnet"
  ) {
    network = WalletAdapterNetwork.Mainnet;
  }

  const endpoint =
    "https://solana-mainnet.g.alchemy.com/v2/8HyVnNutn1gvxwmyKEZf2JfW2EnaQzoN"; // useMemo(() => clusterApiUrl(network), [network]);
  console.log(endpoint);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new MathWalletAdapter(),
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );
  const theme = extendTheme({
    styles: {
      global: () => ({
        body: {
          bg: "",
          color: "",
          input: "",
        },
      }),
    },
  });
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <UmiProvider endpoint={endpoint}>
          <WalletModalProvider>
            <SolanaTimeProvider>
              <Provider store={store}>
                <HelmetProvider>
                  <ThemeContextProvider>
                    <LanguageProvider>
                      <RefreshContextProvider>
                        <ChakraProvider theme={theme}>
                          <ModalProvider>{children}</ModalProvider>
                        </ChakraProvider>
                      </RefreshContextProvider>
                    </LanguageProvider>
                  </ThemeContextProvider>
                </HelmetProvider>
                <ToastContainer />
              </Provider>
            </SolanaTimeProvider>
          </WalletModalProvider>
        </UmiProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Providers;
