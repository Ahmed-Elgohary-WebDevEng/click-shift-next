"use client";

import { ExtraValue, ProductExpandedGallery, ProductFull, Stock } from "@/types/product";
import React, { useMemo, useState } from "react";
import StoreIcon from "@/assets/icons/store";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Price } from "@/components/price";
import DiscountIcon from "@/assets/icons/discount";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { unitify } from "@/utils/unitify";
import { Rating } from "react-simple-star-rating";
import StarCurvedIcon from "@/assets/icons/star-curved";
import useUserStore from "@/global-store/user";
import useSettingsStore from "@/global-store/settings";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { DefaultResponse } from "@/types/global";
import useAddressStore from "@/global-store/address";
import { DetailTabs } from "./detail-tabs";

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

const ProductStock = dynamic(() => import("./product-stock"), { ssr: false });
const ProductGallery = dynamic(
  () => import("./product-gallery").then((component) => ({ default: component.ProductGallery })),
  {
    ssr: false,
    loading: () => (
      <div className=" flex gap-10 aspect-[690/724] max-h-[724px] ">
        <div className="flex-col gap-2  md:w-[120px] hidden md:flex overflow-y-auto flex-wrap">
          {Array.from(Array(10).keys()).map((item) => (
            <div className="w-full aspect-square rounded-2xl bg-gray-300" key={item} />
          ))}
        </div>
        <div className="rounded-2xl bg-gray-300 h-full flex-1" />
      </div>
    ),
  }
);
const ProductActions = dynamic(
  () => import("./product-actions").then((component) => ({ default: component.ProductActions })),
  { ssr: false }
);
const ProductCompareNotifier = dynamic(() => import("./product-compare-notifier"));
const ProductStickyInfo = dynamic(() =>
  import("../product-sticky-info").then((component) => ({ default: component.ProductStickyInfo }))
);

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
      <div className={clsx("xl:container px-2 md:px-4 pb-5 relative")}>
        <div className={clsx("grid lg:gap-7 md:gap-4 gap-2", "grid-cols-7")}>
          <div className="xl:col-span-5 lg:col-span-4  col-span-7">
            <ProductGallery
              selectedColor={selectedColor}
              categoryId={data?.category?.id}
              shopId={data?.shop?.id}
              data={galleries}
              productId={data?.id}
            />
          </div>
          <div
            className={clsx(
              "xl:col-span-2 lg:col-span-3 col-span-7",
              "border border-gray-border dark:border-gray-inputBorder rounded-2xl lg:pt-7 lg:pb-6 lg:px-5 pt-4 px-3 pb-10 mt-5 lg:mt-0"
            )}
          >
            {fullPage && data && (
              <div className="flex items-center justify-between lg:mb-10 lg:mt-0 mt-4 mb-4">
                <div className="flex items-center gap-2.5">
                  <StoreIcon />
                  <span className="text-sm font-medium hover:underline">
                    {t("store")} -{" "}
                    <Link href={`/shops/${data?.shop?.id}`}>{data?.shop?.translation?.title}</Link>
                  </span>
                </div>
                <ProductActions id={data?.id} />
              </div>
            )}
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
                    <strong className="text-[22px] font-bold mr-auto">
                      {data?.translation?.title}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
            <strong className="text-[26px] text-end font-bold whitespace-nowrap">
              <Price number={selectedStock?.total_price} />
            </strong>
            <div className="flex items-end gap-2">
              <div className="flex flex-col h-auto">
                <Rating
                  initialValue={data?.r_avg || 0}
                  allowFraction
                  readonly
                  emptyStyle={{ display: "flex", gap: "5px" }}
                  fillStyle={{ display: "flex", gap: "5px" }}
                  emptyIcon={
                    <span className="text-gray-field">
                      <StarCurvedIcon />
                    </span>
                  }
                  fillIcon={
                    <span className="text-yellow">
                      <StarCurvedIcon />
                    </span>
                  }
                />
              </div>
              <span className="text-sm font-medium">({data?.r_avg || 0})</span>
              <span className="text-sm font-medium">
                {data?.r_count || 0} {t("reviews")}
              </span>
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

            <div className="mt-2.5 flex items-center justify-between flex-wrap">
              <span className="text-base">
                {data?.o_count || 0} {t("people.have.bought.this.item")}
              </span>
              {(selectedStock && data && selectedStock.quantity < data?.min_qty) ||
              !selectedStock?.quantity ? (
                <span className="text-base">{t("out.of.stock")}</span>
              ) : (
                <div className="flex items-center gap-2.5">
                  <span className="text-base">
                    {unitify(selectedStock?.quantity, data?.interval)} {t("in.stock")}
                  </span>
                </div>
              )}
            </div>
            {fullPage && (
              <div className="border-t border-gray-border  pt-4 mt-5 dark:border-gray-inputBorder">
                <div className="font-semibold text-lg">{t("short.description")}</div>
                <span className="text-base line-clamp-3">{data?.translation?.description}</span>
              </div>
            )}
            <ProductStock
              selectedStock={selectedStock}
              onSelectStock={(stock) => setSelectedStock(stock)}
              minQty={data?.min_qty}
              stocks={data?.stocks}
              fullPage={fullPage}
              maxQty={data?.max_qty}
              onSelectColor={(value) => setSelectedColor(value)}
              interval={data?.interval}
              onScrolled={(value) => setShowProductStickyInfo(value)}
            />
          </div>
        </div>

        <DetailTabs data={data} />

        {fullPage && (
          <div className="mt-10">
            <ProductList
              type="alsoBought"
              visibleListCount={6}
              title="with.this.product.also.buy"
              link="/also-bought"
              productId={data?.id}
            />
            {user && (
              <>
                <div className="h-10" />
                <ProductList
                  link="/recently-viewed"
                  type="history"
                  visibleListCount={6}
                  title="recently.viewed"
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
