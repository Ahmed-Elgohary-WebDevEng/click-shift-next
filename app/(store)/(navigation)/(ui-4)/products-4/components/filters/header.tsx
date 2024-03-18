"use client";

import useSettingsStore from "@/global-store/settings";
import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { useTranslation } from "react-i18next";
import FilterLineIcon from "remixicon-react/FilterLineIcon";
import React from "react";
import { Drawer } from "@/components/drawer";
import { useModal } from "@/hook/use-modal";
import { useMediaQuery } from "@/hook/use-media-query";
import dynamic from "next/dynamic";
import { IconButton } from "@/components/icon-button";
import useAddressStore from "@/global-store/address";

const FilterList = dynamic(() =>
  import("./filter-list").then((component) => ({ default: component.FilterList }))
);
const Sorter = dynamic(() =>
  import("./sorter").then((component) => ({ default: component.Sorter }))
);

export const ProductPageHeader = () => {
  const { t } = useTranslation();
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const param = useParams();
  const searchParams = useSearchParams();
  const params = {
    brand_ids: searchParams.getAll("brands"),
    shop_ids: param.id ? [param.id as string] : searchParams.getAll("shop_id"),
    category_ids: searchParams.getAll("categories"),
    type: "category",
    currency_id: currency?.id,
    lang: language?.locale,
    extras: searchParams.getAll("extras"),
    has_discount: searchParams.get("has_discount"),
    region_id: country?.region_id,
  };
  const [isFilterDrawerOpen, openFilterDrawer, closeFilterDrawer] = useModal();
  const isSmallScreen = useMediaQuery("(max-width: 1280px)");

  const { data } = useQuery(["filters", params], () => productService.filters(params));
  return (
    <div className="flex items-center justify-between bg-white dark:bg-darkBgUi3 rounded-lg p-4 md:mb-5 mb-4">
      <span className="text-xl font-semibold">
        {data?.count || 0} {t("products")}
      </span>
      <div className="flex items-center gap-6">
        <div className="hidden md:block">
          <Sorter />
        </div>
        <div className="xl:hidden flex justify-end">
          <IconButton onClick={openFilterDrawer}>
            <FilterLineIcon />
          </IconButton>
        </div>
      </div>
      <Drawer open={isFilterDrawerOpen && isSmallScreen} onClose={closeFilterDrawer}>
        <FilterList onClose={closeFilterDrawer} />
      </Drawer>
    </div>
  );
};
