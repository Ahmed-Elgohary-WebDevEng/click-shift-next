"use client";

import { Banner } from "@/types/banner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import React, { useState } from "react";
import "swiper/css/pagination";
import { MediaRender } from "@/components/media-render";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import useSettingsStore from "@/global-store/settings";
import { Paginate } from "@/types/global";
import { ImageWithFallBack } from "@/components/image";

export const Banners = ({ banners }: { banners?: Paginate<Banner> }) => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data: actualBanners, isLoading } = useQuery(
    ["banners", language?.locale],
    () => bannerService.getAll({ lang: language?.locale }),
    {
      initialData: banners,
    }
  );
  if (isLoading) {
    return (
      <div className="relative rounded-3xl md:h-[350px] h-60 w-full bg-gray-300 animate-pulse" />
    );
  }
  return (
    <div>
      <Swiper
        pagination={{
          clickable: true,
          el: ".banner-pagination",
          bulletClass: "w-2.5 h-2.5 bg-gray-300 rounded-full transition-all",
          bulletActiveClass: "w-6 h-2 !bg-black dark:!bg-white",
        }}
        modules={[Pagination]}
        loop
      >
        {actualBanners?.data?.map((banner) => {
          const image = banner.galleries?.[0].preview || banner.galleries?.[0].path || banner.img;
          return (
            <SwiperSlide key={banner.id}>
              <button
                onClick={() => setSelectedBanner(banner)}
                className="relative rounded-3xl md:h-[350px] h-60 w-full overflow-hidden"
              >
                <ImageWithFallBack
                  src={image}
                  alt={banner.translation?.title || "banner"}
                  className="object-cover w-full h-full"
                  fill
                  priority
                  sizes="(max-width: 376px) 340px, (max-width: 568px) 550px, (768px) 740px, (max-width: 992px) 960px, (max-width:1200px) 1160px, 1440px"
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="banner-pagination flex justify-center my-3 gap-2.5" />
      <Modal onClose={() => setSelectedBanner(null)} isOpen={!!selectedBanner}>
        <div className="sm:py-8 sm:px-8 py-4 px-4">
          <MediaRender
            src={selectedBanner?.galleries?.[0].path || ""}
            preview={selectedBanner?.galleries?.[0].preview}
            alt="banner"
            width={450}
            height={215}
            className="rounded-3xl aspect-[1.5/1] object-cover"
          />
          <div className="text-base mt-6 mb-2">{selectedBanner?.translation?.title}</div>
          <span className="text-sm">{selectedBanner?.translation?.description}</span>
          <Button
            as={Link}
            href={{ pathname: "/products", query: { bannerId: selectedBanner?.id } }}
            color="black"
            className="mt-7"
            fullWidth
          >
            {t("view.product")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
