"use client";

import useSettingsStore from "@/global-store/settings";
import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import useAddressStore from "@/global-store/address";
import { DigitalCard } from "./components/digital-card";

const MyDigitalProducts = () => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["digital"],
    ({ pageParam }) =>
      productService.myDigitalFiles({
        lang: language?.locale,
        page: pageParam,
        country_id: country?.id,
        city_id: city?.id,
        region_id: country?.region_id,
      }),
    {
      suspense: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const digitalProductList = extractDataFromPagination(data?.pages);
  return (
    <div className="">
      <h1 className="font-semibold text-xl mb-5">{t("my.digital.products")}</h1>
      {digitalProductList && digitalProductList.length > 0 ? (
        <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
          <div>
            {digitalProductList?.map((digitalProduct) =>
              digitalProduct.digital_file?.product ? (
                <DigitalCard
                  digitalFileId={digitalProduct.id}
                  data={digitalProduct.digital_file?.product}
                />
              ) : null
            )}
          </div>
        </InfiniteLoader>
      ) : (
        <Empty text={t("there.is.no.digital.products")} />
      )}
    </div>
  );
};

export default MyDigitalProducts;
