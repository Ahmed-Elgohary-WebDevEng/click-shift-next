import { ProductCard } from "@/components/product-card";
import React from "react";
import { Product } from "@/types/product";
import { ListHeader } from "@/components/list-header/list-header";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import clsx from "clsx";

const counts = {
  "5": "xl:grid-cols-5",
  "6": "xl:grid-cols-6",
};

interface ProductListProps {
  products?: Product[];
  isLoading?: boolean;
  title?: string;
  cols?: keyof typeof counts;
  link?: string;
  nothingOnEmpty?: boolean;
  productVariant?: string;
  description?: string;
}

const ProductList = ({
  products,
  isLoading,
  title,
  cols = "6",
  link,
  nothingOnEmpty,
  productVariant,
  description,
}: ProductListProps) => {
  if (products && products.length === 0 && nothingOnEmpty) {
    return null;
  }
  return (
    <>
      {!!title && (
        <ListHeader marginBottom={typeof description === "undefined"} title={title} link={link} />
      )}
      {!!description && <span className="text-sm text-gray-field">{description}</span>}
      <div
        className={clsx(
          "grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  grid-cols-2 lg:gap-7 sm:gap-4 gap-2",
          counts[cols],
          !!description && "mt-4"
        )}
      >
        {isLoading
          ? Array.from(Array(10).keys()).map((product) => <ProductCardUi1Loading key={product} />)
          : products?.map((product) =>
              product ? (
                <ProductCard variant={productVariant} key={product.id} data={product} />
              ) : null
            )}
      </div>
    </>
  );
};

export default ProductList;
