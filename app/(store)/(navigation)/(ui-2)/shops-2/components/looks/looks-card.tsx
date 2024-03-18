import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { Banner } from "@/types/banner";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import useSettingsStore from "@/global-store/settings";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { ProductCard } from "@/components/product-card";
import useAddressStore from "@/global-store/address";

interface LooksCardProps {
  data: Banner;
}

export const LooksCard = ({ data }: LooksCardProps) => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const { data: products, isLoading } = useInfiniteQuery({
    queryKey: ["products", data.id],
    queryFn: ({ pageParam }) =>
      productService.getAll({
        banner_id: data?.id,
        page: pageParam,
        lang: language?.locale,
        currency_id: currency?.id,
        region_id: country?.region_id,
      }),
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    enabled: !!data,
  });
  const productList = extractDataFromPagination(products?.pages);
  return (
    <div className="grid lg:grid-cols-2 gap-7">
      <div className="aspect-[690/500] max-w-max relative">
        <Image
          src={data.img}
          alt={data.translation?.title || "looks"}
          className="object-cover rounded-2xl"
          fill
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-semibold">{data.translation?.title}</span>
          <span className="text-lg">{data.translation?.description}</span>
        </div>
        <div className="flex justify-end my-4">
          <Link
            href={{ query: { looksId: data.id } }}
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
          {isLoading
            ? Array.from(Array(16).keys()).map((product) => (
                <SwiperSlide key={product}>
                  <ProductCardUi1Loading />
                </SwiperSlide>
              ))
            : productList?.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard roundedColors data={product} key={product.id} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};
