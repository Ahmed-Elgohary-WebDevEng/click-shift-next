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
import useSettingsStore from "@/global-store/settings";
import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import { Paginate } from "@/types/global";
import { ImageWithFallBack } from "@/components/image";

export const Banners = ({ banners }: { banners?: Paginate<Banner> }) => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data: actualBanners } = useQuery(
    ["banners", language?.locale],
    () => bannerService.getAll({ lang: language?.locale }),
    {
      initialData: banners,
    }
  );
  return (
    <div className="relative md:col-span-2 min-w-0">
      <Swiper
        pagination={{
          clickable: true,
          el: ".banner-pagination",
          bulletClass: "w-10 h-0.5 bg-white rounded-full transition-all",
          bulletActiveClass: "!bg-black",
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
                className="relative rounded-xl lg:h-[620px] md:h-96 h-60  w-full overflow-hidden"
              >
                <ImageWithFallBack
                  src={image}
                  alt={banner.translation?.title || "banner"}
                  className="object-cover w-full h-full"
                  fill
                  priority
                />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="banner-pagination absolute max-w-max flex justify-center my-3 gap-2.5 z-[2] md:!bottom-10 md:!left-16 !bottom-4 !left-6" />
      <Modal onClose={() => setSelectedBanner(null)} isOpen={!!selectedBanner}>
        <div className="sm:py-8 sm:px-8 py-4 px-4">
          <MediaRender
            src={selectedBanner?.galleries?.[0].path || ""}
            preview={selectedBanner?.galleries?.[0].preview}
            alt="banner"
            width={450}
            height={215}
            className="rounded-3xl aspect-[2/1] object-cover"
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
