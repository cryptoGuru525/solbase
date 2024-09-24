import { EN } from "config/localization/languages";
import { REACT_PUBLIC_RPC } from "config";
const publicUrl = REACT_PUBLIC_RPC;

export const LS_KEY = "BWiLD_language";

export const fetchLocale = async (locale) => {
  const response = await fetch(`${publicUrl}/locales/${locale}.json`);
  const data = await response.json();
  return data;
};

export const getLanguageCodeFromLS = () => {
  try {
    const codeFromStorage = localStorage.getItem(LS_KEY);

    return codeFromStorage || EN.locale;
  } catch {
    return EN.locale;
  }
};
