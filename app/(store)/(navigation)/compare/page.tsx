"use client";

import useCompareStore from "@/global-store/compare";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { LoadingCard } from "@/components/loading";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import React, { useState } from "react";
import useSettingsStore from "@/global-store/settings";
import StarSmileIcon from "@/assets/icons/star-smile";
import { Price } from "@/components/price";
import { findLowestPriceInStocks } from "@/utils/find-lowest-price-in-stocks";
import clsx from "clsx";
import { BackButton } from "@/app/(store)/components/back-button";
import useAddressStore from "@/global-store/address";
import { MainInfo } from "./components/main-info";
import { AdditionalInfo } from "./components/additional-info";
import { ProductTitle } from "./components/product-title";

const ComparePage = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const settings = useSettingsStore((state) => state.settings);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { t } = useTranslation();
  const compareList = useCompareStore((state) => state.ids);
  const { data, isLoading } = useQuery(
    ["compareList", compareList, country?.id, city?.id],
    () =>
      productService.compare({
        ids: compareList,
        lang: language?.locale,
        currency_id: currency?.id,
        country_id: country?.id,
        city_id: city?.id,
        region_id: country?.region_id,
      }),
    {
      enabled: compareList.length > 0,
    }
  );
  const products = data?.data;

  if ((data?.data && data.data.length === 0) || compareList.length === 0) {
    return (
      <section className="xl:container px-2 md:px-4">
        <div className="flex items-center justify-center flex-col my-20">
          <Image src="/img/cartempty.png" alt="empty_cart" width={400} height={400} />
          <span className="text-lg font-medium">{t("compare.list.is.empty")}</span>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return <LoadingCard centered />;
  }

  const categories = products?.map((product) => product[0].category);
  const allStocks = products?.[selectedCategoryIndex].flatMap((product) => product.stocks);
  const allProperties = products?.[selectedCategoryIndex].flatMap((product) => product.properties);
  const productIds = products?.[selectedCategoryIndex].map((product) => product.id);
  const productsMainInfo = products?.[selectedCategoryIndex]
    ? Object.assign(
        {},
        ...(products?.[selectedCategoryIndex]?.map((product) => ({
          [product.id]: { category: product.category, brand: product.brand },
        })) || [])
      )
    : {};

  return (
    <section className="xl:container pb-5 px-2 md:px-4 relative ">
      <BackButton title="compare" />
      <div
        className={clsx(
          "relative overflow-x-auto",
          (settings?.ui_type === "3" || settings?.ui_type === "4") &&
            "px-3 py-3 bg-white dark:p-0 dark:bg-transparent rounded-xl mt-4"
        )}
      >
        {categories && categories.length > 1 && (
          <div className="border border-gray-border rounded-2xl max-w-max flex items-center overflow-hidden my-3 dark:border-gray-bold overflow-x-auto">
            {categories?.map((category, index) => (
              <button
                onClick={() => setSelectedCategoryIndex(index)}
                key={category?.id}
                className={clsx(
                  "px-4 py-3 text-sm outline-none focus-ring",
                  selectedCategoryIndex === index && "bg-primary text-white"
                )}
              >
                {category?.translation?.title}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-7 border-b border-gray-border py-5 sticky top-0 bg-white z-[2] dark:bg-darkBg dark:border-gray-bold overflow-x-auto">
          {products?.[selectedCategoryIndex].map((product) => (
            <ProductTitle data={product} key={product.id} />
          ))}
        </div>
        <div className="flex items-center gap-7 border-b border-gray-border py-2.5 dark:border-gray-bold overflow-x-auto">
          {products?.[selectedCategoryIndex].map((product) => (
            <div className="max-w-compareWidth min-w-[200px] w-[200px] flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-yellow">
                  <StarSmileIcon />
                </span>
                <span className="text-sm font-medium">{product.r_avg}</span>
              </div>
              <span className="text-sm">
                {product.r_count} {t("reviews")}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-7 border-b border-gray-border py-2.5 mb-7 dark:border-gray-bold overflow-x-auto">
          {products?.[selectedCategoryIndex].map((product) => (
            <div className="max-w-compareWidth min-w-[200px] w-[200px] ">
              <strong className="text-base font-semibold">
                {t("from")} <Price number={findLowestPriceInStocks(product.stocks)} />
              </strong>
              <div className="text-sm text-blue-link">
                {product.stocks.length || 0} {t("options")}
              </div>
            </div>
          ))}
        </div>
        <MainInfo productMainInfo={productsMainInfo} productIds={productIds} stocks={allStocks} />
        <div className="h-8" />
        <AdditionalInfo productIds={productIds} properties={allProperties} />
      </div>
    </section>
  );
};

export default ComparePage;
