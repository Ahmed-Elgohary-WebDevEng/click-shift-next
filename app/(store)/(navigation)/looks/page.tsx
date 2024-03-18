"use client";

import useSettingsStore from "@/global-store/settings";
import { bannerService } from "@/services/banner";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { InfiniteLoader } from "@/components/infinite-loader";
import { CollectionCard } from "../../components/collection-card";

const LooksPage = () => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["looks"],
    ({ pageParam }) =>
      bannerService.getAll({
        page: pageParam,
        lang: language?.locale,
        type: "look",
        perPage: 3,
      }),
    {
      suspense: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const looksList = extractDataFromPagination(data?.pages);
  return (
    <div className="xl:container px-2 md:px-4">
      <h1 className="text-3xl font-medium">{t("all.looks")}</h1>
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-7">
          {looksList?.map((look) => (
            <Link scroll={false} key={look.id} replace href={{ query: { looksId: look.id } }}>
              <CollectionCard
                productsCount={look.products_count}
                title={look.translation?.title || ""}
                img={look.img}
                key={look.id}
              />
            </Link>
          ))}
        </div>
      </InfiniteLoader>
    </div>
  );
};

export default LooksPage;
