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

export const Categories = ({ shopId }: { shopId?: number }) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { data, isLoading } = useInfiniteQuery(
    ["categories", "sub_main", searchParams.get("category_id"), shopId],
    ({ pageParam }) =>
      categoryService.getAll({
        lang: language?.locale,
        type: "main",
        page: pageParam,
        product_shop_id: shopId,
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
      <ListHeader title={t("categories")} link={`/main?type=categories&shopId=${shopId}`} />
      <div className="">
        <Swiper
          breakpoints={{
            0: { slidesPerView: 2.5, spaceBetween: 12 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            998: { slidesPerView: 4, spaceBetween: 20 },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 30,
            },
          }}
        >
          {isLoading
            ? Array.from(Array(16).keys()).map((category) => (
                <SwiperSlide key={category}>
                  <div className="aspect-square bg-gray-300 rounded-2xl" />
                </SwiperSlide>
              ))
            : categoryList?.map((category) => (
                <SwiperSlide key={category.id}>
                  <CategoryCard data={category} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};
