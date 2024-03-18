"use client";

import { ProductCard } from "@/components/product-card";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";

const DiscountPage = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const {
    data: discountProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["discountProducts", country?.id, city?.id],
    ({ pageParam }) =>
      productService.getAll({
        page: pageParam,
        has_discount: 1,
        lang: language?.locale,
        currency_id: currency?.id,
        country_id: country?.id,
        region_id: country?.region_id,
        city_id: city?.id,
      }),
    { suspense: true }
  );
  const productList = extractDataFromPagination(discountProducts?.pages);
  if (productList && productList.length === 0) {
    return <Empty animated={false} text="no.discounted.products" />;
  }
  return (
    <div className="xl:container px-2 md:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-7 sm:gap-4 gap-2">
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        {productList?.map((product) => (
          <ProductCard data={product} />
        ))}
      </InfiniteLoader>
    </div>
  );
};

export default DiscountPage;
