import { Ad } from "@/types/ads";
import useSettingsStore from "@/global-store/settings";
import { useQuery } from "@tanstack/react-query";
import useAddressStore from "@/global-store/address";
import { useTranslation } from "react-i18next";
import { adsService } from "@/services/ads";
import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ProductCardUiMiniLoading } from "@/components/product-card/product-card-ui-mini";
import { cardColors } from "@/config/global";

interface AdProductsProps {
  ad?: Ad;
  listIndex: number;
}

export const AdProducts = ({ ad, listIndex }: AdProductsProps) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { t } = useTranslation();
  const params = {
    lang: language?.locale,
    currency_id: currency?.id,
    country_id: country?.id,
    city_id: city?.id,
  };
  const { data, isLoading } = useQuery(
    ["adproducts", params, ad?.id],
    () => adsService.get(String(ad?.id), params),
    {
      enabled: !!ad?.id,
    }
  );

  return (
    <div
      style={{ backgroundColor: cardColors[listIndex % 2] }}
      className={clsx(
        "xl:col-span-2 md:col-span-4 sm:col-span-3  col-span-2 rounded-2xl md:py-10 md:px-7 px-6 py-6"
      )}
    >
      <div className="flex justify-between mb-7">
        <div className="flex flex-col">
          <span className="font-semibold text-2xl">{ad?.translation?.title}</span>
          <span className="text-sm line-clamp-1">{ad?.translation?.description}</span>
        </div>
        <div>
          <Link
            className="text-sm font-medium border border-dark dark:border-white rounded-lg py-2 px-5 max-h-max"
            href={`/promotion/${ad?.id}`}
          >
            {t("see.more")}
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 md:grid-cols-4 grid-cols-2 gap-3">
        {isLoading
          ? Array.from(Array(4).keys()).map((product) => <ProductCardUiMiniLoading key={product} />)
          : data?.data?.shop_ads_packages
              ?.flatMap((pack) => pack?.shop_ads_products)
              .filter((adProduct) => adProduct.product)
              .map((adProduct) => adProduct?.product)
              .map((product, idx) =>
                idx < 4 ? <ProductCard variant="mini" data={product} key={product.id} /> : null
              )}
      </div>
    </div>
  );
};
