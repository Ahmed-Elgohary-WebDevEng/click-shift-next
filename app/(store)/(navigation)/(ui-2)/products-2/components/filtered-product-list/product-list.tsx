"use client";

import { Button } from "@/components/button";
import FilterLineIcon from "remixicon-react/FilterLineIcon";
import React from "react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/hook/use-modal";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hook/use-media-query";
import { FilteredProductList } from "./filtered-product-list";

const FilterList = dynamic(() =>
  import("../filters/filter-list").then((component) => ({ default: component.FilterList }))
);

const ProductList = () => {
  const { t } = useTranslation();
  const [isFilterDrawerOpen, openFilterDrawer, closeFilterDrawer] = useModal();
  const isSmallScreen = useMediaQuery("(max-width: 1280px)");
  return (
    <div className="col-span-7">
      <div className="xl:hidden mb-7 flex justify-end">
        <Button
          onClick={openFilterDrawer}
          size="xsmall"
          color="black"
          leftIcon={<FilterLineIcon />}
        >
          {t("filters")}
        </Button>
      </div>
      <FilteredProductList />
      <Drawer open={isFilterDrawerOpen && isSmallScreen} onClose={closeFilterDrawer}>
        <FilterList onClose={closeFilterDrawer} />
      </Drawer>
    </div>
  );
};

export default ProductList;
