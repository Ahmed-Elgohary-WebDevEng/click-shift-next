"use client";

import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { ProductCard } from "@/components/product-card";
import React from "react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { adsService } from "@/services/ads";
import dynamic from "next/dynamic";

const AdProducts = dynamic(() =>
  import("./ad-products").then((component) => ({ default: component.AdProducts }))
);

export const ProductList = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { t } = useTranslation();
  const params = {
    lang: language?.locale,
    currency_id: currency?.id,
    region_id: country?.region_id,
    country_id: country?.id,
    city_id: city?.id,
  };
  const {
    data: products,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["products", params],
    ({ pageParam }) =>
      productService.getAll({
        ...params,
        page: pageParam,
        perPage: 8,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );

  const {
    data: ads,
    hasNextPage: hasNextAdPage,
    fetchNextPage: fetchNextAdPage,
  } = useInfiniteQuery(
    ["ads", params],
    ({ pageParam }) =>
      adsService.getAll({
        ...params,
        page: pageParam,
        perPage: 2,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );

  const adsList = extractDataFromPagination(ads?.pages);

  return (
    <div className="my-7">
      <ListHeader title={t("all.products")} />
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <InfiniteLoader hasMore={hasNextAdPage} loadMore={fetchNextAdPage}>
          <div
            className={clsx(
              "grid sm:grid-cols-3 md:grid-cols-4  grid-cols-2 lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-6"
            )}
          >
            {isLoading
              ? Array.from(Array(8).keys()).map((product) => (
                  <ProductCardUi1Loading key={product} />
                ))
              : products?.pages.map((productList, idx) => (
                  <React.Fragment key={productList.meta.current_page}>
                    {idx % 2 !== 0 && !!adsList?.[idx] && (
                      <AdProducts listIndex={idx} ad={adsList?.[idx]} />
                    )}
                    {adsList?.[idx] ? (
                      <div className="md:col-span-4 sm:col-span-3 col-span-2 grid  lg:grid-cols-3 grid-cols-2 lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-4">
                        {productList?.data.map((product) => (
                          <ProductCard roundedColors key={product.id} data={product} />
                        ))}
                      </div>
                    ) : (
                      productList?.data.map((product) => (
                        <ProductCard roundedColors key={product.id} data={product} />
                      ))
                    )}
                    {idx % 2 === 0 && !!adsList?.[idx] && (
                      <AdProducts listIndex={idx} ad={adsList?.[idx]} />
                    )}
                  </React.Fragment>
                ))}
          </div>
        </InfiniteLoader>
      </InfiniteLoader>
    </div>
  );
};
