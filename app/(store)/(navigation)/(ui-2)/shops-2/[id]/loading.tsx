import React from "react";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";

const SingleShopLoading = () => (
  <main className="xl:container px-2 md:px-4 animate-pulse">
    <div className="relative md:h-[350px] h-60 rounded-3xl overflow-hidden bg-gray-300" />
    <div className="h-6 rounded-full w-[25%] mt-7 bg-gray-300" />
    <div className="flex gap-7 items-center overflow-x-hidden mt-7">
      {Array.from(Array(6).keys()).map((item) => (
        <div className="min-w-[200px]" key={item}>
          <ProductCardUi1Loading />
        </div>
      ))}
    </div>
  </main>
);

export default SingleShopLoading;
