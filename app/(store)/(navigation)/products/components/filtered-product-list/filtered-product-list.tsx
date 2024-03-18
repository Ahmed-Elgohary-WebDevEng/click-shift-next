"use client";

import { ProductCard } from "@/components/product-card";
import useFilterStore from "@/global-store/filter";
import clsx from "clsx";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import dynamic from "next/dynamic";
import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";

const listStyles = {
  "1": "lg:grid-cols-4 md:grid-cols-3 grid-cols-2  md:gap-7 sm:gap-4 gap-2",
  "2": "lg:grid-cols-2 grid-cols-1  md:gap-7 sm:gap-4 gap-2",
  "3": "grid-cols-1  md:gap-7 sm:gap-4 gap-2",
  "4": "lg:grid-cols-3 md:grid-cols-2 grid-cols-1  md:gap-7 gap-6 ",
};

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

export const FilteredProductList = () => {
  const searchParams = useSearchParams();
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const params = {
    shop_ids: searchParams.getAll("shop_id"),
    category_ids: searchParams.getAll("categories"),
    brand_ids: searchParams.getAll("brands"),
    price_from: searchParams.get("priceFrom"),
    price_to: searchParams.get("priceTo"),
    column: searchParams.get("column"),
    sort: searchParams.get("sort"),
    extras: searchParams.getAll("extras"),
    has_discount: searchParams.get("has_discount"),
    currency_id: currency?.id,
    lang: language?.locale,
    banner_id: searchParams.get("bannerId"),
    region_id: country?.region_id,
    country_id: country?.id,
    city_id: city?.id,
  };
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["products", params],
    queryFn: ({ pageParam }) => productService.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const productList = extractDataFromPagination(data?.pages);

  const productVariant = useFilterStore((state) => state.productVariant);
  if (isLoading) {
    return (
      <div className={clsx("grid ", listStyles[productVariant as keyof typeof listStyles])}>
        {Array.from(Array(10).keys()).map((product) => (
          <ProductCard.Loading variant={productVariant} key={product} />
        ))}
      </div>
    );
  }
  if (productList && productList.length === 0) {
    return <Empty text="no.products.found" />;
  }
  return (
    <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
      <div className={clsx("grid ", listStyles[productVariant as keyof typeof listStyles])}>
        {productList?.map((product) => (
          <ProductCard data={product} variant={productVariant} key={product.id} />
        ))}
      </div>
    </InfiniteLoader>
  );
};
