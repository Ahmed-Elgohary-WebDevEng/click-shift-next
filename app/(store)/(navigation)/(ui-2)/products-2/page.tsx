import React from "react";
import dynamic from "next/dynamic";
import FilteredProductList from "./components/filtered-product-list";
import { FilterList } from "./components/filters/filter-list";

const CategoryFilter = dynamic(() =>
  import("./components/filters/categories").then((component) => ({
    default: component.CategoryFilters,
  }))
);

const Products = () => (
  <div className="xl:container px-2 md:px-4">
    <CategoryFilter />
    <div className="grid xl:grid-cols-9 grid-cols-1 lg:gap-7 md:gap-4 gap-2">
      <div className="xl:col-span-2 hidden xl:block relative">
        <FilterList />
      </div>
      <FilteredProductList />
    </div>
  </div>
);

export default Products;
