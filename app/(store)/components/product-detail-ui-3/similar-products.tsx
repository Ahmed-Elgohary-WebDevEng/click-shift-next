import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { useTranslation } from "react-i18next";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ProductCard } from "@/components/product-card";
import { ListHeader } from "@/components/list-header/list-header";
import { Swiper, SwiperSlide } from "swiper/react";
import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";

interface SimilarProductsProps {
  categoryId?: number;
  shopId?: number;
  productId?: number;
}

const responsiveOptions = {
  992: { slidesPerView: 6, spaceBetween: 30 },
  768: { slidesPerView: 4, spaceBetween: 30 },
  576: { slidesPerView: 3, spaceBetween: 20 },
  340: { slidesPerView: 2, spaceBetween: 20 },
  0: { slidesPerView: 1.5, spaceBetween: 10 },
};

const SimilarProducts = ({ categoryId, shopId, productId }: SimilarProductsProps) => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const { data, isLoading } = useInfiniteQuery(
    ["products", categoryId, shopId, productId],
    ({ pageParam }) =>
      productService.getAll({
        category_id: categoryId,
        shop_id: shopId,
        "not_in[0]": productId,
        lang: language?.locale,
        currency_id: currency?.id,
        page: pageParam,
        region_id: country?.region_id,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const productList = extractDataFromPagination(data?.pages);

  if (productList && productList.length === 0) {
    return null;
  }

  return (
    <div className="md:mt-7 mt-4">
      <ListHeader
        title={t("similar.products")}
        link={`/similar-products/${productId}?shopId=${shopId}&categoryId=${categoryId}`}
      />
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
                  <ProductCard variant="5" roundedColors data={product} />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SimilarProducts;
