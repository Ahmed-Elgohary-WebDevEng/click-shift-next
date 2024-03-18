"use client";

import { ListHeader } from "@/components/list-header/list-header";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import useSettingsStore from "@/global-store/settings";
import { CategoryCard } from "./category-card";

export const Categories = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { data, isLoading } = useInfiniteQuery(
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
    <div className="my-7">
      <ListHeader title={t("categories")} link="/main?type=categories" />
      <div className="">
        {isLoading ? (
          <div className="flex gap-3 items-center overflow-x-hidden w-full">
            {Array.from(Array(16).keys()).map((category) => (
              <div className="min-w-[180px]" key={category}>
                <div className="h-[90px] bg-gray-300 rounded-full " />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            spaceBetween={12}
            breakpoints={{
              0: { slidesPerView: 1.5 },
              576: { slidesPerView: 2.5 },
              768: { slidesPerView: 3 },
              998: { slidesPerView: 4 },
              1024: {
                slidesPerView: 5,
              },
              1200: {
                slidesPerView: 6,
              },
            }}
          >
            {categoryList?.map((category) => (
              <SwiperSlide key={category.id}>
                <CategoryCard data={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};
