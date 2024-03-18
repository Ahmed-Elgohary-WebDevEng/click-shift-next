import React from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "@/components/product-card";
import { AdDetail } from "@/types/ads";
import { MediaRender } from "@/components/media-render";
import { cardColors } from "@/config/global";
import "swiper/css/navigation";

interface AdsCardProps {
  data: AdDetail;
  index: number;
}

export const AdsCard = ({ data, index }: AdsCardProps) => {
  const { t } = useTranslation();
  return (
    <div
      className="grid lg:grid-cols-2 gap-7 rounded-2xl overflow-hidden relative"
      style={{ backgroundColor: cardColors[index % 2] }}
    >
      <div className="md:p-10 sm:p-5 p-3 min-w-0">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-semibold">{data.translation?.title}</span>
          <span className="text-lg">{data.translation?.description}</span>
        </div>
        <div className="flex justify-end my-4">
          <Link
            href={`/promotion/${data.id}`}
            scroll={false}
            className="text-sm font-medium text-blue-link"
          >
            {t("see.all")}
          </Link>
        </div>
        <Swiper
          breakpoints={{
            0: {
              slidesPerView: 1.5,
              spaceBetween: 10,
            },
            530: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >
          {data?.shop_ads_packages
            ?.flatMap((shop) => shop.shop_ads_products)
            .map((adProduct) => adProduct?.product)
            .map((product, idx) =>
              idx < 4 && product ? (
                <SwiperSlide key={product?.id}>
                  <ProductCard roundedColors data={product} />
                </SwiperSlide>
              ) : null
            )}
        </Swiper>
      </div>
      <div className="h-full relative">
        <MediaRender
          src={data.galleries?.[0]?.path || ""}
          preview={data.galleries?.[0]?.preview}
          alt={data.translation?.title || "looks"}
          className="object-cover h-full"
          fill
        />
      </div>
    </div>
  );
};
