"use client";

import { BannerCardHorizontal } from "@/components/banner-card-horizontal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Ad } from "@/types/ads";
import { Modal } from "@/components/modal";
import { MediaRender } from "@/components/media-render";
import { Button } from "@/components/button";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export const SmallBanners = ({ data }: { data?: Ad[] }) => {
  const [selectedBanner, setSelectedBanner] = useState<Ad | null>(null);
  const { t } = useTranslation();
  if (data && data.length === 0) {
    return null;
  }

  return (
    <section className="xl:container px-2 md:px-4  my-7">
      <Swiper
        breakpoints={{
          998: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        spaceBetween={30}
      >
        {data?.map((ad) => (
          <SwiperSlide key={ad.id}>
            <BannerCardHorizontal onClick={(value) => setSelectedBanner(value)} data={ad} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Modal onClose={() => setSelectedBanner(null)} isOpen={!!selectedBanner}>
        <div className="md:px-8 py-8 px-4">
          <MediaRender
            src={selectedBanner?.galleries?.[0].path || ""}
            preview={selectedBanner?.galleries?.[0].preview}
            alt="banner"
            width={450}
            height={215}
            className="rounded-3xl aspect-[2/1] object-cover"
          />
          <div className="text-base mt-6 mb-7">{selectedBanner?.translation?.description}</div>
          <Button as={Link} href={`/promotion/${selectedBanner?.id}`} color="black" fullWidth>
            {t("view.product")}
          </Button>
        </div>
      </Modal>
    </section>
  );
};
