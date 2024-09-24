import { createContext, useContext } from "react";

const DEFAULT_CONTEXT = {
  umi: null,
};

export const UmiContext = createContext(DEFAULT_CONTEXT);

export function useUmi() {
  const umi = useContext(UmiContext).umi;
  if (!umi) {
    throw new Error(
      "Umi context was not initialized. " +
        "Did you forget to wrap your app with <UmiProvider />?"
    );
  }
  return umi;
}
