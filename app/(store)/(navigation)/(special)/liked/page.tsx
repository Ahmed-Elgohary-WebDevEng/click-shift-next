"use client";

import useLikeStore from "@/global-store/like";
import React from "react";
import { Paginate } from "@/types/global";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product-card";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { productService } from "@/services/product";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { likeService } from "@/services/like";
import { extractDataFromPagination } from "@/utils/extract-data";
import useSettingsStore from "@/global-store/settings";
import { InfiniteLoader } from "@/components/infinite-loader";
import { LoadingCard } from "@/components/loading";
import { Empty } from "@/components/empty";
import useUserStore from "@/global-store/user";
import useAddressStore from "@/global-store/address";

const Liked = () => {
  const user = useUserStore((state) => state.user);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { list } = useLikeStore();
  const setLikedProducts = useLikeStore((state) => state.setMeny);
  const {
    data: products,
    isLoading: productsLoading,
    isError: listError,
    isFetching: isFetchingProductsById,
  } = useQuery<Paginate<Product>>(
    ["productsbyids", list, user],
    () =>
      productService.getByIds({
        products: list.map((listItem) => listItem.productId),
        lang: language?.locale,
        currency_id: currency?.id,
        region_id: country?.region_id,
      }),
    {
      enabled: !user,
      retry: false,
      keepPreviousData: true,
    }
  );
  const {
    data: likedProductsList,
    isLoading: likedProductsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(
    ["likedProducts", user, country?.id, city?.id],
    ({ pageParam }) =>
      likeService.getAll({
        type: "product",
        lang: language?.locale,
        currency_id: currency?.id,
        city_id: city?.id,
        country_id: country?.id,
        page: pageParam,
      }),
    {
      enabled: !!user,
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setLikedProducts(
          res.pages
            .flatMap((page) => page.data)
            .map((product) => ({ productId: product.id, sent: true }))
        );
      },
    }
  );
  const likedProducts = extractDataFromPagination(likedProductsList?.pages);

  const actualList = user ? likedProducts : products?.data;
  if ((actualList && actualList.length === 0) || listError) {
    return (
      <div className="flex justify-center relative">
        {isFetching && <LoadingCard centered />}
        <Empty animated={false} text="no.liked.products" />
      </div>
    );
  }
  if (user ? likedProductsLoading : productsLoading) {
    return (
      <div className="xl:container px-2 md:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-7 sm:gap-4 gap-2">
        {Array.from(Array(6).keys()).map((item) => (
          <ProductCardUi1Loading key={item} />
        ))}
      </div>
    );
  }
  return (
    <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
      <div className="xl:container relative px-2 md:px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-7 sm:gap-4 gap-2">
        {(isFetching || isFetchingProductsById) && <LoadingCard centered />}
        {actualList?.map((product) => (
          <ProductCard data={product} key={product.id} />
        ))}
      </div>
    </InfiniteLoader>
  );
};

export default Liked;
