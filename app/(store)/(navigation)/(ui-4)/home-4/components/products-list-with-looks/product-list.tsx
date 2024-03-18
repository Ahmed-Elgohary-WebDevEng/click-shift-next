"use client";

import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import clsx from "clsx";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { ProductCard } from "@/components/product-card";
import React from "react";
import dynamic from "next/dynamic";
import { bannerService } from "@/services/banner";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import { InfiniteLoader } from "@/components/infinite-loader";

const LookCard = dynamic(() =>
  import("./look-card").then((component) => ({ default: component.LookCard }))
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
  const { t } = useTranslation();
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
        perPage: 2,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.links.next && canFetchNextPage && lastPage.meta.current_page + 1,
    }
  );

  const {
    data: products,
    isLoading,
    hasNextPage: hasNextProductPage,
    fetchNextPage: fetchNextProductPage,
    isFetchingNextPage: isFetchingNextProductPage,
  } = useInfiniteQuery(
    ["products", params, initialPage],
    ({ pageParam = initialPage }) =>
      productService.getAll({
        ...params,
        page: pageParam,
        perPage: 6,
      }),
    {
      getNextPageParam: (lastPage) =>
        lastPage.links.next && canFetchNextPage && lastPage.meta.current_page + 1,
    }
  );

  return (
    <div className="lg:my-7 my-4">
      <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg">
        <ListHeader title={t("deals.of.the.day")} />

        <InfiniteLoader
          hasMore={hasNextProductPage}
          loadMore={fetchNextProductPage}
          loading={isFetchingNextProductPage}
        >
          <InfiniteLoader hasMore={hasNextLookPage} loadMore={fetchNextLookPage}>
            <div
              className={clsx(
                "grid sm:grid-cols-3 md:grid-cols-4  grid-cols-2 lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-5"
              )}
            >
              {isLoading
                ? Array.from(Array(8).keys()).map((product) => (
                    <ProductCardUi1Loading key={product} />
                  ))
                : products?.pages?.map((productPage, productIdx) =>
                    !!looks?.pages?.[productIdx]?.data?.[0] &&
                    looks?.pages?.[productIdx]?.data?.[1] ? (
                      <div
                        className={clsx(
                          "grid sm:grid-cols-3 md:grid-cols-4  grid-cols-2 lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-5 xl:col-span-5 md:col-span-4 sm:col-span-3 col-span-2"
                        )}
                      >
                        {productPage.data.map((product, idx) => (
                          <React.Fragment key={product.id}>
                            <ProductCard variant="6" roundedColors data={product} />
                            {idx === 1 && looks?.pages?.[productIdx]?.data?.[0] && (
                              <LookCard look={looks?.pages?.[productIdx]?.data?.[0]} />
                            )}
                            {idx === 3 && looks?.pages?.[productIdx]?.data?.[1] && (
                              <LookCard look={looks?.pages?.[productIdx]?.data?.[1]} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      productPage.data.map((product) => (
                        <ProductCard variant="6" roundedColors data={product} key={product.id} />
                      ))
                    )
                  )}
            </div>
          </InfiniteLoader>
        </InfiniteLoader>
      </div>
    </div>
  );
};
