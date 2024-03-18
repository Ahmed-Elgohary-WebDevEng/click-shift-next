"use client";

import { ExtraValue, ProductExpandedGallery } from "@/types/product";
import Image from "next/image";
import React, { memo, useEffect, useRef, useState } from "react";
import { Mousewheel, Scrollbar, Thumbs, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperType from "swiper";
import clsx from "clsx";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import FrameIcon from "@/assets/icons/frame";
import { useTranslation } from "react-i18next";
import { MediaRender } from "@/components/media-render";

interface ProductGalleryProps {
  data?: ProductExpandedGallery[];
  selectedColor?: ExtraValue;
  categoryId?: number;
  shopId?: number;
  productId?: number;
}

const SimilarProducts = dynamic(() => import("./similar-products"));

export const ProductGallery = memo(
  ({ data, selectedColor, categoryId, shopId, productId }: ProductGalleryProps) => {
    const { t } = useTranslation();
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const mainSwiperRef = useRef<{ swiper: SwiperType }>(null);
    const currentImageIndex = data?.findIndex(
      (galleryItem) => galleryItem.color?.value === selectedColor?.value
    );
    const [isSimilarProductsModalOpen, setIsSimilarProductsModalOpen] = useState(false);
    useEffect(() => {
      if (currentImageIndex && currentImageIndex >= 0) {
        mainSwiperRef.current?.swiper.slideTo(currentImageIndex);
        thumbsSwiper?.slideTo(currentImageIndex);
      } else {
        mainSwiperRef.current?.swiper.slideTo(0);
      }
    }, [selectedColor]);
    return (
      <div className="flex gap-7 md:h-[724px] h-96 xl:mr-20">
        <div className="h-full hidden md:block">
          <Swiper
            className="product-detail h-full"
            modules={[Thumbs]}
            direction="vertical"
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            spaceBetween={8}
          >
            {data?.map((image) => (
              <SwiperSlide className="!h-max" key={image.img}>
                <Image
                  src={image.preview || image.img}
                  className={clsx("rounded-2xl aspect-square  object-cover ")}
                  alt={image.color?.value || ""}
                  width={150}
                  height={150}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="vertical-scroll h-full w-1 bg-gray-border rounded-full hidden md:block" />
        <div className="min-w-0 w-full relative">
          <button
            onClick={() => setIsSimilarProductsModalOpen(true)}
            className="bg-dark bg-opacity-30 backdrop-blur-md dark:bg-white dark:bg-opacity-50 dark:text-dark rounded-full py-2.5 px-3 inline-flex items-center gap-2.5 text-sm font-medium absolute md:top-7 md:bottom-auto md:right-7 right-2 bottom-2 rtl:left-2 rtl:max-w-max z-[2] outline-none focus-ring"
          >
            <FrameIcon />
            {t("similar")}
          </button>
          <Swiper
            ref={mainSwiperRef}
            modules={[Thumbs, Mousewheel, Scrollbar, Pagination]}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            slidesPerView={1}
            mousewheel
            className="h-full"
            initialSlide={currentImageIndex || 0}
            watchSlidesProgress
            breakpoints={{
              0: {
                direction: "horizontal",
              },
              768: {
                direction: "vertical",
              },
            }}
            pagination={{
              clickable: true,
              el: ".banner-pagination",
              bulletClass: "w-2.5 h-1 bg-gray-300 rounded-full transition-all",
              bulletActiveClass: "!w-10 h-1 !bg-black",
            }}
            scrollbar={{
              draggable: true,
              el: ".vertical-scroll",
              dragClass: "bg-gray-field",
              enabled: true,
              hide: false,
            }}
          >
            {data?.map((image) => (
              <SwiperSlide className="!h-full" key={image.img}>
                <MediaRender
                  preview={image.preview}
                  src={image.img}
                  alt={image.color?.value || "color"}
                  className="rounded-2xl object-contain aspect-[690/724] h-full"
                  fill
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="banner-pagination flex justify-center my-3 gap-2.5 md:hidden" />
        </div>

        <Modal
          isOpen={isSimilarProductsModalOpen}
          onClose={() => setIsSimilarProductsModalOpen(false)}
          withCloseButton
          size="xlarge"
        >
          <SimilarProducts productId={productId} categoryId={categoryId} shopId={shopId} />
        </Modal>
      </div>
    );
  }
);
