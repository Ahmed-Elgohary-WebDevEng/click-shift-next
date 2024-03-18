"use client";

import useAddressStore from "@/global-store/address";
import useSettingsStore from "@/global-store/settings";
import { productService } from "@/services/product";
import { Paginate } from "@/types/global";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import ProductList from "@/app/(store)/components/product-list";

export const DiscountedProducts = ({ products }: { products?: Paginate<Product> }) => {
  const languge = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const params = {
    lang: languge?.locale,
    currency_id: currency?.id,
    regions_id: country?.region_id,
    country_id: country?.id,
    city_id: city?.id,
  };
  const { data: actualProductList, isLoading } = useQuery(
    ["discountedProducts", params],
    () => productService.getAll(params),
    {
      initialData: products,
    }
  );
  return (
    <div className="my-7">
      <ProductList
        link="/products"
        cols="5"
        products={actualProductList?.data}
        title="new.arrivals"
        nothingOnEmpty
        isLoading={isLoading}
      />
    </div>
  );
};
