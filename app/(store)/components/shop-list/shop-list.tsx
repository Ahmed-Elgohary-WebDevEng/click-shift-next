import { ShopCard } from "@/components/shop-card";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import useSettingsStore from "@/global-store/settings";
import { Empty } from "@/components/empty";
import useAddressStore from "@/global-store/address";

const ShopList = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["shops", country?.id, city?.id],
    queryFn: ({ pageParam }) =>
      shopService.getAll({
        page: pageParam,
        lang: language?.locale,
        country_id: country?.id,
        city_id: city?.id,
      }),
    suspense: true,
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const shopList = extractDataFromPagination(data?.pages);
  if (shopList && shopList.length === 0) {
    return <Empty text="there.is.no.shops" />;
  }
  return (
    <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-7 gap-4 mt-4">
        {shopList?.map((shop) => (
          <ShopCard data={shop} key={shop.id} />
        ))}
      </div>
    </InfiniteLoader>
  );
};

export default ShopList;
