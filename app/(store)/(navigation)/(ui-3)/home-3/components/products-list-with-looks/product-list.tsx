"use client";

import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import clsx from "clsx";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { ProductCard } from "@/components/product-card";
import React from "react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import dynamic from "next/dynamic";
import { bannerService } from "@/services/banner";

const LookAndProducts = dynamic(() =>
  import("./look-adn-products").then((component) => ({ default: component.LookAndProducts }))
);

interface ProductListProps {
  canFetchNextPage: boolean;
  initialPage: number;
}

export const ProductList = ({ canFetchNextPage, initialPage }: ProductListProps) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const params = {
    lang: language?.locale,
    currency_id: currency?.id,
    region_id: country?.region_id,
    country_id: country?.id,
    city_id: city?.id,
  };

  const {
    data: looks,
    hasNextPage: hasNextLookPage,
    fetchNextPage: fetchNextLookPage,
  } = useInfiniteQuery(
    ["looks", initialPage],
    ({ pageParam = initialPage }) =>
      bannerService.getAll({
        page: pageParam,
        lang: language?.locale,
        type: "look",
        perPage: 1,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.links.next && canFetchNextPage && lastPage.meta.current_page + 1,
    }
  );
  const looksList = extractDataFromPagination(looks?.pages);

  const {
    data: products,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["products", params, initialPage],
    ({ pageParam = initialPage }) =>
      productService.getAll({
        ...params,
        page: pageParam,
        perPage: 8,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.links.next && canFetchNextPage && lastPage.meta.current_page + 1,
    }
  );

  return (
    <div className="my-7">
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <InfiniteLoader hasMore={hasNextLookPage} loadMore={fetchNextLookPage}>
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
                    {idx % 2 === 0 && !!looksList?.[idx] && (
                      <LookAndProducts look={looksList?.[idx]} />
                    )}
                    {looksList?.[idx] ? (
                      <div
                        className={clsx(
                          "md:col-span-4 sm:col-span-3 col-span-2 grid  lg:grid-cols-3 grid-cols-2 lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-4"
                        )}
                      >
                        {productList?.data.map((product) => (
                          <ProductCard variant="5" roundedColors key={product.id} data={product} />
                        ))}
                      </div>
                    ) : (
                      productList?.data.map((product) => (
                        <ProductCard variant="5" roundedColors key={product.id} data={product} />
                      ))
                    )}
                    {idx % 2 !== 0 && !!looksList?.[idx] && (
                      <LookAndProducts look={looksList?.[idx]} />
                    )}
                  </React.Fragment>
                ))}
          </div>
        </InfiniteLoader>
      </InfiniteLoader>
    </div>
  );
};
