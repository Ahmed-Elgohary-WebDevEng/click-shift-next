"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { InfiniteLoader } from "@/components/infinite-loader";
import ProductList from "@/app/(store)/components/product-list";
import { extractDataFromPagination } from "@/utils/extract-data";
import useSettingsStore from "@/global-store/settings";
import { useSearchParams } from "next/navigation";
import useAddressStore from "@/global-store/address";

const RecentlyViewedProducts = () => {
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const searchParams = useSearchParams();
  const productId = Number(searchParams.get("product_id"));
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["products", "alsoBought", productId, language?.locale, currency?.id, country?.id, city?.id],
    ({ pageParam }) =>
      productService.alsoBought(
        {
          lang: language?.locale,
          currency_id: currency?.id,
          page: pageParam,
          region_id: country?.region_id,
          country_id: country?.id,
          city_id: city?.id,
        },
        productId
      ),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const products = extractDataFromPagination(data?.pages);
  return (
    <div className="xl:container px-2 md:px-4">
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <ProductList title="also.bought" isLoading={isLoading} products={products} />
      </InfiniteLoader>
    </div>
  );
};

export default RecentlyViewedProducts;
