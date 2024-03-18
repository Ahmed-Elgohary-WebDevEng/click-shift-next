"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Swiper, SwiperSlide } from "swiper/react";
import { adsService } from "@/services/ads";
import useAddressStore from "@/global-store/address";
import AnchorLeft from "@/assets/icons/anchor-left";
import { Navigation } from "swiper/modules";
import { AdsCard } from "./ads-card";

export const Ads = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const params = {
    lang: language?.locale,
    currency_id: currency?.id,
    country_id: country?.id,
    city_id: city?.id,
  };
  const { data: ads } = useInfiniteQuery(
    ["ads", params],
    ({ pageParam }) =>
      adsService.getAll({
        ...params,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const adList = extractDataFromPagination(ads?.pages);
  if (adList && adList.length === 0) {
    return null;
  }
  return (
    <div className="my-7 relative">
      <Swiper
        allowTouchMove={false}
        modules={[Navigation]}
        navigation={{ enabled: true, nextEl: ".next", prevEl: ".prev" }}
      >
        {adList?.map((ad) => (
          <SwiperSlide key={ad.id}>
            <AdsCard data={ad} />
          </SwiperSlide>
        ))}
        <div className="flex items-center absolute top-4 gap-4 right-4 z-[2]">
          <button className="prev  disabled:bg-gray-layout bg-dark rounded-full text-white disabled:text-dark">
            <AnchorLeft />
          </button>
          <button className="next rotate-180 disabled:bg-gray-layout bg-dark rounded-full text-white disabled:text-dark ">
            <AnchorLeft />
          </button>
        </div>
      </Swiper>
    </div>
  );
};
