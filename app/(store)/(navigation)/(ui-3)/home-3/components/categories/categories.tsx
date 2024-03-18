"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSearchParams } from "next/navigation";
import useSettingsStore from "@/global-store/settings";
import Link from "next/link";
import Image from "next/image";
import AnchorLeft from "@/assets/icons/anchor-left";
import { InfiniteLoader } from "@/components/infinite-loader";

export const Categories = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const searchParams = useSearchParams();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["categories", "sub_main", searchParams.get("category_id")],
    ({ pageParam }) =>
      categoryService.getAll({
        lang: language?.locale,
        type: "main",
        page: pageParam,
        parent_id: searchParams.get("category_id"),
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const categoryList = extractDataFromPagination(data?.pages);
  if (categoryList && categoryList.length === 0) {
    return null;
  }
  return (
    <div className="xl:container px-2 md:px-4 rounded-xl bg-white dark:bg-darkBgUi3 hidden lg:block ">
      <div className=" p-5 overflow-y-auto max-h-[620px] ">
        <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
          <div className="flex flex-col gap-4">
            {isLoading
              ? Array.from(Array(36).keys()).map((category) => (
                  <div key={category} className="h-4 bg-gray-300 rounded-full animate-pulse" />
                ))
              : categoryList?.map((category) => (
                  <Link
                    href={`/main?category_id=${category.id}&type=categories`}
                    key={category.id}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={category.img || ""}
                        alt={category.translation?.title || "category"}
                        width={24}
                        height={24}
                      />
                      <span className="text-base font-medium">{category.translation?.title}</span>
                    </div>
                    <span className="rotate-180 text-gray-field group-hover:text-dark dark:group-hover:text-white">
                      <AnchorLeft />
                    </span>
                  </Link>
                ))}
          </div>
        </InfiniteLoader>
      </div>
    </div>
  );
};
