/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import router_abi from "config/abis/router";
import factory_abi from "config/abis/factory";
import { getFactoryAddress, getRouterAddress } from "utils/addressHelpers";

export const ContractContext = React.createContext(null);

export const ContractContextProvideer = (props) => {
  const router_address = getRouterAddress();
  const factory_address = getFactoryAddress();

  const provider = null;
  const signer = null;

  const [routerSigner, setRouterSigner] = useState();
  const [factorySigner, setFactorySigner] = useState();

  const [routerProvider, setRouterProvider] = useState();
  const [factoryProvider, setFactoryProvider] = useState();

  return (
    <>
      <ContractContext.Provider
        value={{
          provider,
          signer,
          routerProvider,
          factoryProvider,
          routerSigner,
          factorySigner,
          router_address,
          factory_address,
        }}
      >
        {props.children}
      </ContractContext.Provider>
    </>
  );
};

export default ContractContextProvideer;
