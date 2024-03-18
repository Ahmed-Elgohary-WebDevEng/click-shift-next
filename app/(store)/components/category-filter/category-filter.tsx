"use client";

import clsx from "clsx";
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname, useSearchParams } from "next/navigation";
import useSettingsStore from "@/global-store/settings";

interface CategoryFilterProps {
  extra?: React.ReactElement;
  container?: boolean;
}

export const CategoryFilter = ({ extra, container }: CategoryFilterProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category_id")
  );
  const pathname = usePathname();
  const { data, isLoading } = useInfiniteQuery(
    ["categories", "main"],
    ({ pageParam }) =>
      categoryService.getAll({ type: "main", page: pageParam, lang: language?.locale }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const categoryList = extractDataFromPagination(data?.pages);
  return (
    <div
      className={clsx(
        "flex justify-between min-w-0 mb-2 flex-col sm:flex-row sm:items-center gap-4 flex-col-reverse",
        container && "xl:container px-2 md:px-4",
        !container && "border-b border-gray-border dark:border-gray-inputBorder py-4"
      )}
    >
      <div
        className={clsx(
          "min-w-0 flex-1",
          container && "border-b border-gray-border dark:border-gray-inputBorder py-4"
        )}
      >
        <Swiper spaceBetween={20} slidesPerView="auto">
          {isLoading ? (
            Array.from(Array(20).keys()).map((category) => (
              <SwiperSlide key={category} className="max-w-max">
                <div className="bg-gray-300 h-10 w-20 rounded-full" />
              </SwiperSlide>
            ))
          ) : (
            <>
              <SwiperSlide className="max-w-max">
                <Link
                  href={{ pathname, query: { type: searchParams.get("type") } }}
                  scroll={false}
                  replace
                  onClick={() => setSelectedCategory(null)}
                  className={clsx(
                    "capitalize md:text-lg text-base font-semibold  md:py-2.5 py-1 block",
                    !selectedCategory &&
                      "bg-dark rounded-full md:px-4 px-2 text-white dark:bg-white dark:text-dark"
                  )}
                >
                  {t("all")}
                </Link>
              </SwiperSlide>
              {categoryList?.map((category) => (
                <SwiperSlide className="max-w-max h-full" key={category.id}>
                  <Link
                    href={{ query: { category_id: category.id, type: searchParams.get("type") } }}
                    scroll={false}
                    replace
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={clsx(
                      "capitalize md:text-lg text-base md:py-2.5 py-1 font-semibold block",
                      category.id === Number(selectedCategory) &&
                        "bg-dark rounded-full md:px-4 px-2 text-white dark:bg-white dark:text-dark"
                    )}
                  >
                    {category.translation?.title}
                  </Link>
                </SwiperSlide>
              ))}
            </>
          )}
        </Swiper>
      </div>
      {extra}
    </div>
  );
};
