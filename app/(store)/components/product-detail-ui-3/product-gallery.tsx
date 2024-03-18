"use client";

import { ExtraValue, ProductExpandedGallery } from "@/types/product";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperType from "swiper";
import clsx from "clsx";
import { MediaRender } from "@/components/media-render";

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
  useEffect(() => {
    if (currentImageIndex && currentImageIndex >= 0) {
      mainSwiperRef.current?.swiper.slideTo(currentImageIndex);
      thumbsSwiper?.slideTo(currentImageIndex);
    } else {
      mainSwiperRef.current?.swiper.slideTo(0);
    }
  }, [selectedColor]);
  return (
    <div className="min-w-0 w-full sticky top-4">
      <div className="md:h-[610px] h-96">
        <Swiper
          ref={mainSwiperRef}
          modules={[Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          slidesPerView={1}
          className="h-full"
          initialSlide={currentImageIndex || 0}
          watchSlidesProgress
        >
          {data?.map((image) => (
            <SwiperSlide className="!h-full" key={image.stock.id}>
              <MediaRender
                preview={image.preview}
                src={image.img}
                alt={image.color?.value || "color"}
                className="rounded-xl object-contain aspect-[690/724] h-full"
                fill
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="h-full  mt-7">
        <Swiper
          className="product-detail-3 h-full"
          modules={[Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView="auto"
          spaceBetween={24}
          watchSlidesProgress
        >
          {data?.map((image) => (
            <SwiperSlide className="!h-max !w-max" key={image.stock.id}>
              <Image
                src={image.preview || image.img}
                className={clsx(
                  "rounded-xl aspect-square max-h-24 max-w-[96px] md:max-w-none md:max-h-none object-cover hover:object-contain"
                )}
                alt={image.color?.value || ""}
                width={183}
                height={159}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
