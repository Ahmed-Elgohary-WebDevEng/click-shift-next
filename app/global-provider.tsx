"use client";

import useSettingsStore from "@/global-store/settings";
import { Country, Currency, Language } from "@/types/global";
import React, { useEffect } from "react";
import "@/lib/i18n";
import { setCookie } from "cookies-next";
import { useTranslation } from "react-i18next";
import useAddressStore from "@/global-store/address";

interface GlobalProviderProps extends React.PropsWithChildren {
  languages?: Language[];
  currencies?: Currency[];
  settings?: Record<string, string>;
  defaultCountry?: Country;
}

const GlobalProvider = ({
  children,
  languages,
  currencies,
  settings,
  defaultCountry,
}: GlobalProviderProps) => {
  const { i18n } = useTranslation();
  const defaultCurrency = currencies?.find((currency) => currency.default);
  const defaultLanguage = languages?.find((lang) => Boolean(lang.default));
  const updateCountry = useAddressStore((state) => state.updateCountry);
  const selectedCountry = useAddressStore((state) => state.country);
  const {
    selectedCurrency,
    selectedLanguage,
    updateSelectedCurrency,
    updateSelectedLanguage,
    updateSettings,
    updateDefaultCurrency,
  } = useSettingsStore();

  useEffect(() => {
    if (settings) {
      const tempSettings = { ...settings };
      if (process.env.NEXT_PUBLIC_UI_TYPE) {
        tempSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
      }
      updateSettings(tempSettings);
    }
    const newSelectedCurrency = currencies?.find(
      (currency) => currency.id === selectedCurrency?.id
    );
    if (newSelectedCurrency) {
      updateSelectedCurrency(newSelectedCurrency);
    } else if (defaultCurrency) {
      updateSelectedCurrency(defaultCurrency);
    }
    if (defaultCurrency) {
      updateDefaultCurrency(defaultCurrency);
    }
    const newSelectedLanguage = languages?.find((language) => language.id === selectedLanguage?.id);
    const language = newSelectedLanguage || defaultLanguage;
    const currency = newSelectedCurrency || defaultCurrency;
    i18n.changeLanguage(language?.locale);
    const html = document.documentElement;
    setCookie("lang", language?.locale);
    setCookie("dir", language?.backward ? "rtl" : "ltr");
    setCookie("currency_id", currency?.id);
    html.setAttribute("lang", language?.locale || "en");
    html.setAttribute("dir", language?.backward ? "rtl" : "ltr");
    if (language) {
      updateSelectedLanguage(language);
    }
    if (!selectedCountry && defaultCountry) {
      updateCountry(defaultCountry);
      setCookie("country_id", defaultCountry.id);
    }
  }, []);

  return children;
};

export default GlobalProvider;
