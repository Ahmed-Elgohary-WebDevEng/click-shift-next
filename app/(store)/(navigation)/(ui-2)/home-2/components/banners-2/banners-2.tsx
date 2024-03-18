"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import AnchorLeft from "@/assets/icons/anchor-left";
import React, { useState } from "react";
import "swiper/css/navigation";
import { Banner } from "@/types/banner";
import { ImageWithFallBack } from "@/components/image";
import Link from "next/link";
import { MediaRender } from "@/components/media-render";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { useTranslation } from "react-i18next";

export const Banners2 = ({ banners }: { banners?: Banner[] }) => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { t } = useTranslation();
  return (
    <div className="min-w-0 relative">
      <Swiper
        className="h-full"
        modules={[Navigation]}
        navigation={{ enabled: true, nextEl: ".next", prevEl: ".prev" }}
      >
        {banners?.map((banner) => (
          <SwiperSlide key={banner.id}>
            <button
              onClick={() => setSelectedBanner(banner)}
              className="relative rounded-3xl md:h-[520px] sm:h-80 h-96 w-full overflow-hidden"
            >
              <ImageWithFallBack
                src={banner.galleries?.[0]?.preview || banner.img}
                alt={banner.translation?.title || "banner"}
                fill
                className="object-cover "
                priority
                sizes="(max-width: 376px) 340px, (max-width: 568px) 550px, (768px) 740px, (max-width: 992px) 300px, (max-width:1200px) 370px, 485px"
              />
            </button>
          </SwiperSlide>
        ))}
        <div className="flex items-center absolute bottom-4 gap-4 right-4 z-[2]">
          <button
            aria-label="previous slide"
            className="prev  disabled:bg-gray-layout bg-dark rounded-full text-white disabled:text-dark"
          >
            <AnchorLeft />
          </button>
          <button
            aria-label="next slide"
            className="next rotate-180 disabled:bg-gray-layout bg-dark rounded-full text-white disabled:text-dark "
          >
            <AnchorLeft />
          </button>
        </div>
      </Swiper>
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
