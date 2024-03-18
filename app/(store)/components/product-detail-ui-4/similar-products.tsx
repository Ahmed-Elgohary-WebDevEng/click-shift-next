import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { useTranslation } from "react-i18next";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ProductCard } from "@/components/product-card";
import { ListHeader } from "@/components/list-header/list-header";
import useSettingsStore from "@/global-store/settings";
import clsx from "clsx";
import React from "react";
import { ProductCardUi7Loading } from "@/components/product-card/product-card-ui-7";
import useAddressStore from "@/global-store/address";

interface SimilarProductsProps {
  categoryId?: number;
  shopId?: number;
  productId?: number;
}

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
        perPage: 9,
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
      <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg">
        <ListHeader
          title={t("similar.products")}
          link={`/similar-products/${productId}?shopId=${shopId}&categoryId=${categoryId}`}
        />
        <div className={clsx("grid  md:grid-cols-2  lg:gap-7 sm:gap-4 gap-2 xl:grid-cols-3")}>
          {isLoading
            ? Array.from(Array(8).keys()).map((product) => <ProductCardUi7Loading key={product} />)
            : productList?.map((product) => (
                <ProductCard variant="7" key={product.id} roundedColors data={product} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarProducts;
