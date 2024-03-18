"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSearchParams } from "next/navigation";
import useSettingsStore from "@/global-store/settings";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Paginate } from "@/types/global";
import { Category } from "@/types/category";

export const CategoriesSwiper = ({ categories }: { categories?: Paginate<Category> }) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const searchParams = useSearchParams();
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["categories", "sub_main", searchParams.get("category_id"), language?.locale],
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
  const actualCategoryList = isLoading ? categories?.data : categoryList;
  return (
    <div className="xl:container px-2 md:px-4">
      <Swiper
        className="mb-4"
        slidesPerView="auto"
        spaceBetween={30}
        onReachEnd={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
      >
        {actualCategoryList?.map((category) => (
          <SwiperSlide key={category.id} className="max-w-max">
            <Link
              className="lg:text-base text-sm hover:text-primary transition-all"
              href={`/main?type=categories&category_id=${category.id}`}
            >
              {category.translation?.title}
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
