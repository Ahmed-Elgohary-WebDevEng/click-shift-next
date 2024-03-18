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
import clsx from "clsx";

export const Banners = ({ banners }: { banners?: Paginate<Banner> }) => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | undefined>();
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
    <div className="grid lg:grid-cols-7 grid-rows-7 gap-6 lg:mb-7 mb-4">
      <div
        className={clsx(
          "relative min-w-0 ",
          banners?.data && banners.data.length > 3 ? "lg:col-span-5" : "lg:col-span-7"
        )}
        style={{ gridRow: "span 7" }}
      >
        <Swiper
          pagination={{
            clickable: true,
            el: ".banner-pagination",
            bulletClass: "w-2.5 h-1 bg-gray-300 rounded-full transition-all",
            bulletActiveClass: "w-6 h-1 !bg-primary dark:!bg-primary",
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
                  className="relative rounded-xl lg:h-[536px] md:h-96 h-60  w-full overflow-hidden"
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
        <div className="banner-pagination absolute max-w-max flex justify-center my-3 gap-2.5 z-[2] bottom-2 !left-1/2 -translate-x-1/2" />
        <Modal onClose={() => setSelectedBanner(undefined)} isOpen={!!selectedBanner}>
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
      {banners?.data && banners.data.length > 3 && (
        <button
          onClick={() => setSelectedBanner(banners.data.at(-2))}
          className="lg:col-span-2 row-span-3 relative lg:col-start-6 rounded-xl overflow-hidden hidden lg:block"
        >
          <ImageWithFallBack
            src={banners.data.at(-2)?.galleries?.[0].preview || banners.data.at(-2)?.img || ""}
            alt="banner"
            className="object-cover"
            fill
          />
        </button>
      )}
      {banners?.data && banners.data.length > 3 && (
        <button
          onClick={() => setSelectedBanner(banners.data.at(-1))}
          className="lg:col-span-2 row-span-4 relative lg:col-start-6 row-start-4 rounded-xl overflow-hidden hidden lg:block"
        >
          <ImageWithFallBack
            src={banners.data.at(-1)?.galleries?.[0].preview || banners.data.at(-1)?.img || ""}
            alt="banner"
            className="object-cover"
            fill
          />
        </button>
      )}
    </div>
  );
};
