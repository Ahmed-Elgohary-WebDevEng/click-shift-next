"use client";

import useSettingsStore from "@/global-store/settings";
import { useEffect, useState } from "react";
import { Currency } from "@/types/global";

interface PriceProps {
  number?: number | null;
  customCurrency?: Currency;
}

export const Price = ({ number, customCurrency }: PriceProps) => {
  const [mounted, setMounted] = useState(false);
  const tempNumber = Number.isInteger(number) ? number : number?.toFixed(2);
  const { selectedCurrency } = useSettingsStore();
  const tempCurrency = customCurrency || selectedCurrency;
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  if (tempCurrency?.position === "after") {
    return (
      <>
        {tempNumber || 0} {tempCurrency?.symbol}
      </>
    );
  }
  return (
    <>
      {tempCurrency?.symbol} {tempNumber || 0}
    </>
  );
};
