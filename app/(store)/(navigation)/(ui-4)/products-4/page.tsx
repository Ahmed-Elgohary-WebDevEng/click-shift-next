import React from "react";
import dynamic from "next/dynamic";
import FilteredProductList from "./components/filtered-product-list";
import { FilterList } from "./components/filters/filter-list";
import { ProductPageHeader } from "./components/filters/header";

const Sorter = dynamic(() =>
  import("./components/filters/sorter").then((component) => ({ default: component.Sorter }))
);

const Products = ({ shopId }: { shopId?: number }) => (
  <div className="xl:container px-2 md:px-4">
    <ProductPageHeader />
    <div className="grid xl:grid-cols-9 grid-cols-1 lg:gap-7 md:gap-4 gap-2 bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg">
      <div className="col-span-full md:hidden">
        <Sorter />
      </div>
      <div className="xl:col-span-2 hidden xl:block relative ">
        <FilterList shopId={shopId} />
      </div>
      <FilteredProductList shopId={shopId} />
    </div>
  </div>
);

export default Products;
