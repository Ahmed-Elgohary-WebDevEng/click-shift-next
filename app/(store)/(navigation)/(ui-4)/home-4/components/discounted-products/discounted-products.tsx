"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { productService } from "@/services/product";
import { useQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import { Navigation } from "swiper/modules";
import AnchorLeft from "@/assets/icons/anchor-left";
import React from "react";
import { DiscountedProductCard } from "./discounted-product-card";
import "swiper/css/navigation";

export const DiscountedProducts = () => {
  const lang = useSettingsStore((state) => state.selectedLanguage)?.locale;
  const currencyId = useSettingsStore((state) => state.selectedCurrency)?.id;
  const country = useAddressStore((state) => state.country);
  const cityId = useAddressStore((state) => state.city)?.id;
  const params = {
    lang,
    currency_id: currencyId,
    region_id: country?.region_id,
    country_id: country?.id,
    city_id: cityId,
    has_discount: 1,
  };
  const { data: products } = useQuery(["discounts", params], () => productService.getAll(params));

  return (
    <div className="min-w-0 bg-white dark:bg-darkBgUi3 rounded-xl relative">
      <Swiper
        className="h-full"
        modules={[Navigation]}
        navigation={{ enabled: true, nextEl: ".next", prevEl: ".prev" }}
      >
        {products?.data.map((product) => (
          <SwiperSlide key={product.id}>
            <DiscountedProductCard data={product} />
          </SwiperSlide>
        ))}
        <button className="prev absolute top-1/2 -translate-y-1/2 left-2 z-[2] bg-gray-layout rounded-full text-gray-field">
          <AnchorLeft />
        </button>
        <button className="next rotate-180 bg-gray-layout absolute top-1/2 -translate-y-1/2 z-[2] right-2 rounded-full text-gray-field">
          <AnchorLeft />
        </button>
      </Swiper>
    </div>
  );
};
