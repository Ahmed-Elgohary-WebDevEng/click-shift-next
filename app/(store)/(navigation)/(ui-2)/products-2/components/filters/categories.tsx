"use client";

import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useQueryParams } from "@/hook/use-query-params";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import useSettingsStore from "@/global-store/settings";
import { productService } from "@/services/product";
import useAddressStore from "@/global-store/address";

export const CategoryFilters = () => {
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const searchParams = useSearchParams();
  const params = {
    brand_ids: searchParams.getAll("brands"),
    shop_ids: searchParams.getAll("shop_id"),
    category_ids: searchParams.getAll("categories"),
    type: "category",
    currency_id: currency?.id,
    lang: language?.locale,
    extras: searchParams.getAll("extras"),
    has_discount: searchParams.get("has_discount"),
    region_id: country?.region_id,
  };

  const { data: filters } = useQuery(["filters", params], () => productService.filters(params));
  const { setQueryParams } = useQueryParams();
  const selectedCategories = searchParams.getAll("categories");
  const handleSelect = (categoryId: number) => {
    setQueryParams({ categories: categoryId });
  };

  if (filters?.categories && filters.categories.length === 0) {
    return null;
  }
  return (
    <div className="my-5">
      <Swiper slidesPerView="auto" spaceBetween={14}>
        {filters?.categories.map((category) => (
          <SwiperSlide key={category.id} className="max-w-max">
            <button
              className={clsx(
                "outline-primary rounded-full flex items-center gap-4 bg-gray-card py-2 pl-5 pr-10 hover:bg-gray-layout transition-all dark:hover:bg-gray-darkSegment dark:bg-darkBgUi3",
                selectedCategories.includes(category.id.toString()) &&
                  "bg-primary hover:bg-primary dark:bg-primary dark:hover:bg-primary"
              )}
              onClick={() => handleSelect(category.id)}
            >
              <Image
                src={category.img || ""}
                alt={category.title}
                width={50}
                height={50}
                className="object-contain md:h-[50px] h-7 w-auto"
              />
              <span
                className={clsx(
                  "text-lg font-semibold",
                  selectedCategories.includes(category.id.toString()) && "text-white"
                )}
              >
                {category.title}
              </span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
