"use client";

import React from "react";
import { FilteredProductList } from "./filtered-product-list";

const ProductList = ({ shopId }: { shopId?: number }) => (
  <div className="col-span-7">
    <FilteredProductList shopId={shopId} />
  </div>
);

export default ProductList;
