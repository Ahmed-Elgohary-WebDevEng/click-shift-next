"use client";

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";
import { extractDataFromPagination } from "@/utils/extract-data";
import Link from "next/link";

const BrandList = () => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["brandList"],
    queryFn: ({ pageParam }) => brandService.getAll({ page: pageParam }),
    suspense: true,
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const brandList = extractDataFromPagination(data?.pages);
  return (
    <div className="mt-4 rounded-xl bg-white dark:bg-darkBgUi3 md:p-4 p-2.5">
      <Swiper
        breakpoints={{
          0: { slidesPerView: 3.5 },
          576: { slidesPerView: 5 },
          768: { slidesPerView: 6 },
          992: { slidesPerView: 7 },
          1120: {
            slidesPerView: 12,
          },
        }}
        spaceBetween={12}
        onReachEnd={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      >
        {brandList?.map((brand) => (
          <SwiperSlide key={brand.id}>
            <Link href={`/products?brands=${brand.id}`}>
              <div className="border relative border-gray-border dark:border-gray-inputBorder rounded-xl px-2 py-4 flex justify-center items-center md:aspect-[104/74] aspect-[74/40]">
                <Image src={brand.img} alt="brand" fill className="object-contain h-full w-auto" />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandList;
