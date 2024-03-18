"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Filter } from "@/types/product";
import Image from "next/image";
import { useQueryParams } from "@/hook/use-query-params";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";

export const CategoryFilters = () => {
  const queryClient = useQueryClient();
  const filters = queryClient.getQueryData<Filter>(["filters"], { exact: false });
  const { setQueryParams } = useQueryParams();
  const searchParams = useSearchParams();
  const selectedCategories = searchParams.getAll("categories");
  const handleSelect = (categoryId: number) => {
    setQueryParams({ categories: categoryId });
  };

  if (filters?.categories && filters.categories.length === 0) {
    return null;
  }
  return (
    <div className="xl:container px-2 md:px-4 my-5">
      <Swiper slidesPerView="auto" spaceBetween={14}>
        {filters?.categories.map((category) => (
          <SwiperSlide key={category.id} className="max-w-max">
            <button
              className={clsx(
                "outline-primary rounded-full flex items-center gap-4 bg-gray-card py-2 pl-5 pr-10 hover:bg-gray-layout transition-all",
                selectedCategories.includes(category.id.toString()) && "bg-primary hover:bg-primary"
              )}
              onClick={() => handleSelect(category.id)}
            >
              <Image
                src={category.img || ""}
                alt={category.title}
                width={50}
                height={50}
                className="object-contain h-[50px] w-auto"
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
