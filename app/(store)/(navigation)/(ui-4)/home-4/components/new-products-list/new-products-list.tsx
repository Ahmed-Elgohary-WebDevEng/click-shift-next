"use client";

import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import clsx from "clsx";
import { ProductCard } from "@/components/product-card";
import React from "react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import { ProductCardUi7Loading } from "@/components/product-card/product-card-ui-7";

export const NewProducts = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { t } = useTranslation();
  const params = {
    lang: language?.locale,
    currency_id: currency?.id,
    country_id: country?.id,
    region_id: country?.region_id,
    city_id: city?.id,
    column: "id",
    sort: "desc",
  };

  const { data: products, isLoading } = useInfiniteQuery(
    ["products", params],
    ({ pageParam = 1 }) =>
      productService.getAll({
        ...params,
        page: pageParam,
        perPage: 9,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );

  const productList = extractDataFromPagination(products?.pages);

  return (
    <div className="lg:mb-7 mb-4">
      <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg">
        <ListHeader title={t("recently.added")} link="/products?sort=desc&column=id" />

        <div className={clsx("grid  md:grid-cols-2  lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-3")}>
          {isLoading
            ? Array.from(Array(8).keys()).map((product) => <ProductCardUi7Loading key={product} />)
            : productList?.map((product) => (
                <ProductCard variant="7" key={product.id} roundedColors data={product} />
              ))}
        </div>
      </div>
    </div>
  );
};
