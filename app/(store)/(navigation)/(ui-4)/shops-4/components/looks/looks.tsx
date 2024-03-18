"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import useSettingsStore from "@/global-store/settings";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Swiper, SwiperSlide } from "swiper/react";
import AnchorLeft from "@/assets/icons/anchor-left";
import { Navigation } from "swiper/modules";
import { LooksCard } from "./looks-card";

export const Looks = ({ shopId }: { shopId?: number }) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data } = useInfiniteQuery(
    ["looks", shopId],
    ({ pageParam }) =>
      bannerService.getAll({
        page: pageParam,
        lang: language?.locale,
        type: "look",
        shop_id: shopId,
      }),
    {
      suspense: true,
    }
  );
  const looksList = extractDataFromPagination(data?.pages);
  if (looksList && looksList.length === 0) {
    return null;
  }
  return (
    <div className="my-7">
      <Swiper
        allowTouchMove={false}
        modules={[Navigation]}
        navigation={{ enabled: true, nextEl: ".next", prevEl: ".prev" }}
        breakpoints={{
          0: {
            slidesPerGroup: 1,
          },
          992: {
            slidesPerGroup: 2,
          },
        }}
      >
        {looksList?.map((look) => (
          <SwiperSlide key={look.id}>
            <LooksCard data={look} />
          </SwiperSlide>
        ))}

        <div className="flex items-center absolute bottom-4 gap-4 right-4 z-[2]">
          <button className="prev  disabled:hidden bg-dark rounded-full text-white disabled:text-dark">
            <AnchorLeft />
          </button>
          <button className="next rotate-180 disabled:hidden bg-dark rounded-full text-white disabled:text-dark ">
            <AnchorLeft />
          </button>
        </div>
      </Swiper>
    </div>
  );
};
