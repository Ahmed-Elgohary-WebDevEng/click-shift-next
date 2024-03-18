"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { InfiniteLoader } from "@/components/infinite-loader";
import ProductList from "@/app/(store)/components/product-list";
import { extractDataFromPagination } from "@/utils/extract-data";
import useSettingsStore from "@/global-store/settings";
import { useSearchParams } from "next/navigation";
import useAddressStore from "@/global-store/address";

const RecentlyViewedProducts = ({ params }: { params: { id: string } }) => {
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const categoryId = searchParams.get("categoryId");
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["products", categoryId, shopId, params.id],
    ({ pageParam }) =>
      productService.getAll({
        category_id: categoryId,
        shop_id: shopId,
        "not_in[0]": params.id,
        lang: language?.locale,
        currency_id: currency?.id,
        page: pageParam,
        region_id: country?.region_id,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const productList = extractDataFromPagination(data?.pages);
  return (
    <div className="xl:container px-2 md:px-4">
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <ProductList
          productVariant="5"
          title="similar.products"
          isLoading={isLoading}
          products={productList}
        />
      </InfiniteLoader>
    </div>
  );
};

export default RecentlyViewedProducts;
