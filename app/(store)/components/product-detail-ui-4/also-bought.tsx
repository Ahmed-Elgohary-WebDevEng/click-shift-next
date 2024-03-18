import { ListHeader } from "@/components/list-header/list-header";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { ProductCard } from "@/components/product-card";
import { useTranslation } from "react-i18next";
import useSettingsStore from "@/global-store/settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import useAddressStore from "@/global-store/address";

interface AlsoBoughtProductProps {
  productId?: number | string;
}

const visibleListCount = 5;

const responsiveOptions = {
  992: { slidesPerView: visibleListCount, spaceBetween: 30 },
  768: { slidesPerView: visibleListCount / 1.5, spaceBetween: 30 },
  576: { slidesPerView: visibleListCount / 2, spaceBetween: 20 },
  340: { slidesPerView: visibleListCount / 3, spaceBetween: 20 },
  0: { slidesPerView: visibleListCount / 3.5, spaceBetween: 10 },
};

const AlsoBought = ({ productId }: AlsoBoughtProductProps) => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const { data, isLoading } = useInfiniteQuery(
    ["alsoBought", productId],
    ({ pageParam }) =>
      productService.alsoBought(
        {
          lang: language?.locale,
          currency_id: currency?.id,
          page: pageParam,
          region_id: country?.region_id,
        },
        productId
      ),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const productList = extractDataFromPagination(data?.pages);

  if (productList && productList.length === 0) {
    return null;
  }
  return (
    <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg">
      <ListHeader title={t("similar.products")} link={`/also-bought?product_id=${productId}`} />
      <div className="min-w-0">
        <Swiper breakpoints={responsiveOptions}>
          {isLoading
            ? Array.from(Array(10).keys()).map((product) => (
                <SwiperSlide key={product}>
                  <ProductCardUi1Loading />
                </SwiperSlide>
              ))
            : productList?.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard variant="6" roundedColors data={product} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AlsoBought;
