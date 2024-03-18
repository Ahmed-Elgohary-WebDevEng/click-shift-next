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

export const Categories = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { data, isLoading } = useInfiniteQuery(
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
    <div className="mb-7">
      <ListHeader container title={t("categories")} link="/main?type=categories" />
      <div className="xl:container px-2 md:px-4">
        <Swiper
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 2.5 },
            354: { slidesPerView: 3 },
            576: { slidesPerView: 4 },
            768: { slidesPerView: 6 },
            998: { slidesPerView: 8 },
            1024: {
              slidesPerView: 9,
            },
            1200: {
              slidesPerView: 10,
            },
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
                  <CategoryCard size="small" data={category} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};
