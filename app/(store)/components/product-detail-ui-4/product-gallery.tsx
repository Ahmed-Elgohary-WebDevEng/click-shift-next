"use client";

import { ExtraValue, ProductExpandedGallery } from "@/types/product";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Thumbs, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperType from "swiper";
import clsx from "clsx";
import { MediaRender } from "@/components/media-render";
import "swiper/css/pagination";

interface ProductGalleryProps {
  data?: ProductExpandedGallery[];
  selectedColor?: ExtraValue;
}

export const ProductGallery = ({ data, selectedColor }: ProductGalleryProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<{ swiper: SwiperType }>(null);
  const currentImageIndex = data?.findIndex(
    (galleryItem) => galleryItem.color?.value === selectedColor?.value
  );
  const video = data?.find((galleryItem) => !!galleryItem.preview) || data?.at(-1);
  useEffect(() => {
    if (currentImageIndex && currentImageIndex >= 0) {
      mainSwiperRef.current?.swiper.slideTo(currentImageIndex);
      thumbsSwiper?.slideTo(currentImageIndex);
    } else {
      mainSwiperRef.current?.swiper.slideTo(0);
    }
  }, [selectedColor]);
  return (
    <div className="min-w-0 w-full sticky top-4 grid sm:grid-cols-2 lg:gap-7 md:gap-4 gap-2">
      <div className=" bg-white dark:bg-darkBgUi3 rounded-lg overflow-hidden pb-4 sm:pb-0">
        <Swiper
          ref={mainSwiperRef}
          modules={[Thumbs, Pagination]}
          pagination={{
            clickable: true,
            el: ".banner-pagination",
            bulletClass: "w-2.5 h-1 bg-gray-300 rounded-full transition-all",
            bulletActiveClass: "w-8 h- !bg-primary dark:!bg-primary",
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          slidesPerView={1}
          className="h-full max-h-full"
          initialSlide={currentImageIndex || 0}
          watchSlidesProgress
        >
          {data?.map((image) => (
            <SwiperSlide key={image.stock.id}>
              <MediaRender
                preview={image.preview}
                src={image.img}
                alt={image.color?.value || "color"}
                className="rounded-lg object-contain  w-full md:!h-[560px] !h-96 !relative"
                fill
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="banner-pagination flex justify-center gap-2.5 mt-1 sm:hidden" />
      </div>
      <div className="min-w-0 sm:flex flex-col lg:gap-7 md:gap-4 gap-2">
        {!!video && (
          <div className="flex-1 relative bg-white dark:bg-darkBgUi3 rounded-lg overflow-hidden">
            <MediaRender
              src={video.img}
              preview={video.preview}
              alt={video.stock.product?.translation?.title || "product"}
              fill
              className="object-contain h-full w-full "
            />
          </div>
        )}
        <div className="flex-1">
          <Swiper
            className="product-detail-3 h-full"
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView={2}
            spaceBetween={24}
            watchSlidesProgress
          >
            {data?.map((image) => (
              <SwiperSlide key={image.stock.id}>
                <div className="relative" />
                <Image
                  src={image.preview || image.img}
                  className={clsx("rounded-lg  object-cover ")}
                  alt={image.color?.value || ""}
                  fill
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};
