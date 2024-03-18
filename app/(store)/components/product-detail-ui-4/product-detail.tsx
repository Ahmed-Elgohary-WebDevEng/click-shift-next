"use client";

import { ExtraValue, ProductExpandedGallery, ProductFull, Stock } from "@/types/product";
import React, { useMemo, useState } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Price } from "@/components/price";
import DiscountIcon from "@/assets/icons/discount";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { unitify } from "@/utils/unitify";
import useSettingsStore from "@/global-store/settings";
import useUserStore from "@/global-store/user";
import StarSmileIcon from "@/assets/icons/star-smile";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { DefaultResponse } from "@/types/global";
import useAddressStore from "@/global-store/address";
import { ProductProperties } from "./product-properties";
import { ProductGallery } from "./product-gallery";

interface ProductDetailProps {
  initialData?: DefaultResponse<ProductFull>;
  fullPage?: boolean;
}

const ProductList = dynamic(
  () =>
    import("@/app/(store)/components/slidable-product-list").then((component) => ({
      default: component.SlidableProductList,
    })),
  {
    ssr: false,
  }
);

const ProductStock = dynamic(() => import("./product-stock"), {
  ssr: false,
  loading: () => <div className="h-10 rounded-full w-3/5 bg-gray-300 animate-pulse" />,
});
const ProductExtras = dynamic(() => import("./product-extras"));
const ProductReviews = dynamic(() =>
  import("./product-reviews").then((component) => component.ProductReviews)
);

const ProductActions = dynamic(
  () => import("./product-actions").then((component) => ({ default: component.ProductActions })),
  { ssr: false }
);
const ProductCompareNotifier = dynamic(() => import("./product-compare-notifier"));
const SimilarProducts = dynamic(() => import("./similar-products"));
const AlsoBoughtProducts = dynamic(() => import("./also-bought"));
const ProductStickyInfo = dynamic(() =>
  import("../product-sticky-info").then((component) => ({ default: component.ProductStickyInfo }))
);
const BrandList = dynamic(() => import("./brand-list"));

export const ProductDetail = ({ initialData, fullPage }: ProductDetailProps) => {
  const user = useUserStore((state) => state.user);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const { data: productDetail } = useQuery(
    ["product", initialData?.data.id, language?.locale, currency?.id],
    () =>
      productService.get(initialData?.data.uuid, {
        lang: language?.locale,
        currency_id: currency?.id,
        region_id: country?.region_id,
      }),
    {
      initialData,
    }
  );
  const data = productDetail?.data;
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const defaultStock =
    data?.stocks.find((stock) => stock.id === Number(searchParams.get("stock_id"))) ||
    data?.stocks?.[0];
  const [selectedStock, setSelectedStock] = useState<Stock | undefined>(defaultStock);
  const defaultColor = defaultStock?.extras?.find((extra) => extra?.group?.type === "color")?.value;
  const [selectedColor, setSelectedColor] = useState<ExtraValue | undefined>(defaultColor);
  const [showProductStickyInfo, setShowProductStickyInfo] = useState(false);
  const galleries = useMemo(() => {
    const tempGalleries: ProductExpandedGallery[] = [];
    data?.galleries.forEach((gallery) => {
      tempGalleries.push({
        stock: data?.stocks?.[0],
        img: gallery.path,
        preview: gallery.preview,
      });
    });
    data?.stocks.forEach((stock) => {
      const color = stock.extras.find((extra) => extra.group.type === "color")?.value;

      if (stock.galleries && stock.galleries.length > 0 && color) {
        stock.galleries.forEach((gallery) => {
          tempGalleries.push({
            stock,
            img: gallery.path,
            color,
            preview: gallery.preview,
          });
        });
      }
    });
    return tempGalleries;
  }, [data]);
  return (
    <div className="pb-10 md:pb-0">
      {fullPage && <ProductCompareNotifier id={data?.id} />}
      {showProductStickyInfo && <ProductStickyInfo data={data} selectedStock={selectedStock} />}
      <div
        className={clsx(
          fullPage ? "xl:container px-2 md:px-4 pb-5" : "pt-10 sm:pt-5 px-4 sm:px-5 pb-5 "
        )}
      >
        <div
          className={clsx(
            "grid lg:gap-7 md:gap-4 gap-2",
            fullPage ? "grid-cols-2" : "sm:grid-cols-2 grid-cols-1"
          )}
        >
          <div className="col-span-full ">
            <ProductGallery selectedColor={selectedColor} data={galleries} />
          </div>
          <div
            className={clsx(
              fullPage ? "lg:col-span-1 col-span-2" : "mt-8",
              "bg-white dark:bg-darkBgUi3 rounded-xl lg:pt-7 lg:pb-6 lg:px-5 pt-4 px-3 pb-4"
            )}
          >
            <table className="w-full">
              <thead />
              <tbody>
                {selectedStock && selectedStock?.discount && (
                  <tr>
                    <td>
                      <div className="rounded-full bg-red py-0.5 pl-0.5 px-3 max-w-max flex items-center text-white gap-1">
                        <DiscountIcon />
                        <span className="text-sm font-medium ">
                          -{Math.floor((selectedStock.discount / selectedStock.price) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="w-3">
                      <span className="text-sm text-end font-semibold text-primary line-through whitespace-nowrap">
                        <Price number={selectedStock?.price} />
                      </span>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <strong className="xl:text-[34px] lg:text-3xl md:text-2xl text-xl font-medium mr-auto">
                      {data?.translation?.title}
                    </strong>
                  </td>
                  <td>
                    {fullPage && data && (
                      <div className="flex items-center justify-end ">
                        <ProductActions id={data?.id} />
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex items-center gap-4 md:mt-5 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-yellow">
                  <StarSmileIcon />
                </span>
                <span className="text-base font-medium text-gray-field">
                  {data?.r_avg || 0} ({data?.r_count || 0} {t("reviews")})
                </span>
              </div>
              <div className="bg-gray-border h-4 w-px dark:bg-gray-inputBorder" />
              <div className="flex items-center gap-1 ">
                <span className="text-base font-semibold">{data?.o_count || 0}</span>{" "}
                <span className="text-gray-field">{t("purchased")}</span>
              </div>
              <div className="bg-gray-border h-4 w-px dark:bg-gray-inputBorder" />
              <div className="flex items-center gap-1 ">
                {(selectedStock && data && selectedStock.quantity < data?.min_qty) ||
                !selectedStock?.quantity ? null : (
                  <span className="text-base font-semibold">
                    {unitify(selectedStock?.quantity, data?.interval)}
                  </span>
                )}
                <span className="text-base text-gray-field">
                  {(selectedStock && data && selectedStock.quantity < data?.min_qty) ||
                  !selectedStock?.quantity
                    ? t("out.of.stock")
                    : t("in.stock")}
                </span>
              </div>
            </div>

            {selectedStock?.whole_sale_prices?.length !== 0 && (
              <div className="my-4">
                {selectedStock?.whole_sale_prices?.map((wholeSale) => (
                  <div key={wholeSale.id} className="flex items-center justify-between">
                    <span>
                      {unitify(wholeSale.min_quantity)} - {unitify(wholeSale.max_quantity)}{" "}
                      {data?.unit?.translation?.title}
                    </span>
                    <span>
                      <Price number={wholeSale.price} />
                    </span>
                  </div>
                ))}
              </div>
            )}

            <ProductExtras
              selectedStock={selectedStock}
              onSelectStock={(stock) => setSelectedStock(stock)}
              stocks={data?.stocks}
              onSelectColor={(value) => setSelectedColor(value)}
            />
            <ProductProperties data={data} />
          </div>
          <div
            className={clsx(
              fullPage ? "lg:col-span-1 col-span-2 flex flex-col lg:gap-7 md:gap-4 gap-2" : "mt-8"
            )}
          >
            <div className="bg-white dark:bg-darkBgUi3 rounded-xl lg:pt-7 lg:pb-6 lg:px-5 pt-4 px-3 pb-4 ">
              <ProductStock
                selectedStock={selectedStock}
                minQty={data?.min_qty}
                maxQty={data?.max_qty}
                interval={data?.interval}
                onScrolled={(value) => setShowProductStickyInfo(value)}
              />
            </div>
            <div className="bg-white dark:bg-darkBgUi3 rounded-xl lg:pt-7 lg:pb-6 lg:px-5 pt-4 px-3 pb-4  lg:mt-0 flex-1">
              <ProductReviews data={data} />
            </div>
          </div>
        </div>

        <div className="lg:mt-7 md:mt-4 mt-2">
          <AlsoBoughtProducts productId={data?.uuid} />
          <SimilarProducts
            productId={data?.id}
            shopId={data?.shop?.id}
            categoryId={data?.category?.id}
          />
          {user && (
            <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg lg:mt-7 md:mt-4 mt-2">
              <ProductList
                link="/recently-viewed"
                type="history"
                visibleListCount={5}
                title="recently.viewed"
                productVariant="6"
                params={{
                  lang: language?.locale,
                  currency_id: currency?.id,
                }}
              />
            </div>
          )}
        </div>
        <BrandList />
      </div>
    </div>
  );
};
