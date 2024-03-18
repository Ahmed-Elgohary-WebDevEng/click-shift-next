"use client";

import { CategoryCard } from "@/components/category-card";
import { ListHeader } from "@/components/list-header/list-header";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import useSettingsStore from "@/global-store/settings";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import ChevronRightIcon from "@/assets/icons/chevron-right";

export const Categories = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["categories", "sub_main", searchParams.get("category_id")],
    ({ pageParam }) =>
      categoryService.getAll({
        lang: language?.locale,
        type: "sub_main",
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
    <div className="lg:my-7 my-4">
      <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg relative">
        <ListHeader title={t("popular.categories")} />
        <Swiper
          spaceBetween={12}
          modules={[Navigation]}
          onReachEnd={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
          breakpoints={{
            0: { slidesPerView: 2.5 },
            354: { slidesPerView: 3 },
            576: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            998: { slidesPerView: 8 },
          }}
        >
          {isLoading
            ? Array.from(Array(16).keys()).map((category) => (
                <SwiperSlide key={category}>
                  <div className="h-[180px] bg-gray-300 rounded-3xl" />
                </SwiperSlide>
              ))
            : categoryList?.map((category) => (
                <SwiperSlide key={category.id}>
                  <CategoryCard bordered size="small" data={category} />
                </SwiperSlide>
              ))}
          {isFetchingNextPage && (
            <SwiperSlide>
              <div className="h-[180px] bg-gray-300 rounded-3xl" />
            </SwiperSlide>
          )}
        </Swiper>
        <button className="swiper-button-prev !text-dark !w-9 !h-9 !shadow-select !left-0.5 !z-[1]">
          <ChevronRightIcon />
        </button>
        <button className="swiper-button-next !text-dark !w-9 !h-9 !shadow-select !right-0.5 !z-[1]">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};
