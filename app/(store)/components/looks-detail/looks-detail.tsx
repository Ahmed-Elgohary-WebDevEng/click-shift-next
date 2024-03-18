import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import useSettingsStore from "@/global-store/settings";
import { Swiper, SwiperSlide } from "swiper/react";
import { MediaRender } from "@/components/media-render";
import React from "react";
import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import clsx from "clsx";
import { ProductCard } from "@/components/product-card";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { Pagination } from "swiper/modules";
import dynamic from "next/dynamic";
import { Cart, InsertCartPayload, InsertProduct } from "@/types/cart";
import { cartService } from "@/services/cart";
import useAddressStore from "@/global-store/address";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";
import { useRouter } from "next/navigation";
import { DefaultResponse } from "@/types/global";
import useCartStore, { CartProduct } from "@/global-store/cart";
import { hasCookie } from "cookies-next";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);
export const LooksDetail = ({ id }: { id: number }) => {
  const { t } = useTranslation();
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateLocalCart = useCartStore((state) => state.updateList);
  const isAuthenticated = hasCookie("token");

  const { mutate: insertToCart, isLoading: isInserting } = useMutation({
    mutationFn: (body: InsertCartPayload) => cartService.insert(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
    onSuccess: (res) => {
      success(t("products.added.to.cart"));
      router.push("/cart");
      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        () => res
      );
      const cartProducts = res.data.user_carts.flatMap((userCart) =>
        userCart.cartDetails.flatMap((detail) =>
          detail.cartDetailProducts.map((product) => ({
            stockId: product.stock.id,
            quantity: product.quantity,
          }))
        )
      );
      updateLocalCart(cartProducts);
    },
  });

  const { data: look, isError } = useQuery(
    ["look", id],
    () => bannerService.get(id, { lang: language?.locale }),
    {
      suspense: true,
      enabled: !!id,
    }
  );

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["products", look?.data.id],
    queryFn: ({ pageParam }) =>
      productService.getAll({
        banner_id: look?.data?.id,
        page: pageParam,
        lang: language?.locale,
        currency_id: currency?.id,
        region_id: country?.region_id,
      }),
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    enabled: !!look?.data,
  });
  const productList = extractDataFromPagination(data?.pages);

  const handleInsertToCart = () => {
    const products: InsertProduct[] = [];
    productList?.forEach((product) => {
      const defaultStock = product.stocks[0];
      if (product.min_qty <= defaultStock.quantity) {
        const tempProduct: InsertProduct = {
          stock_id: defaultStock.id,
          quantity: product.min_qty || 1,
        };
        if (defaultStock.galleries) {
          tempProduct.images = [defaultStock.galleries[0].path];
        }
        products.push(tempProduct);
      }
    });
    if (currency && country)
      if (isAuthenticated) {
        insertToCart({
          products,
          currency_id: currency?.id,
          rate: currency?.rate,
          country_id: country?.id,
          region_id: country?.region_id,
          city_id: city?.id,
        });
        return;
      }
    updateLocalCart(
      products.map((product) => {
        const tempProduct: CartProduct = {
          stockId: product.stock_id,
          quantity: product.quantity,
        };
        if (product.images) {
          tempProduct.image = product.images?.[0];
        }
        return tempProduct;
      })
    );
    router.push("/cart");
  };

  if (isError) {
    return <Empty text="no.looks.found" />;
  }

  return (
    <div className="xl:container px-2 md:px-4 grid lg:grid-cols-7 gap-7">
      <div className="lg:col-span-2 hidden lg:block">
        <div className="sticky top-0 min-w-0">
          <Swiper
            slidesPerView={1}
            modules={[Pagination]}
            pagination={{
              clickable: true,
              el: ".gallery-pagination",
              bulletClass: "w-8 h-0.5 !bg-gray-200 rounded-full transition-all",
              bulletActiveClass: "!bg-gray-field",
              enabled: true,
            }}
          >
            {look?.data.galleries?.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="flex justify-center  md:aspect-[411/609] aspect-[1/3] h-[609px] sm:max-h-none md:w-auto relative">
                  <MediaRender
                    src={image.path}
                    preview={image.preview}
                    fill
                    alt={image.title}
                    className="rounded-2xl md:object-cover object-contain w-full"
                  />
                </div>
              </SwiperSlide>
            ))}
            <div
              className="gallery-pagination transition-all absolute z-[2] !bottom-2 left-1 right-1 flex justify-center gap-2.5"
              style={{ top: "unset" }}
            />
          </Swiper>
        </div>
      </div>
      <div className="lg:col-span-5">
        {/* eslint-disable-next-line no-nested-ternary */}
        {isLoading ? (
          <div className={clsx("grid gap-7 grid-cols-1")}>
            {Array.from(Array(3).keys()).map((product) => (
              <ProductCard.Loading variant="3" key={product} />
            ))}
          </div>
        ) : productList && productList.length > 0 ? (
          <div className={clsx("grid lg:gap-7 gap-4 grid-cols-1")}>
            <InfiniteLoader
              loadMore={fetchNextPage}
              hasMore={hasNextPage}
              loading={isFetchingNextPage}
            >
              {productList?.map((product) => (
                <ProductCard data={product} variant="3" key={product.id} />
              ))}
            </InfiniteLoader>
          </div>
        ) : (
          <Empty text="no.products.found" />
        )}
        <div className="mb-20 flex flex-col">
          <strong className="text-lg font-medium">{t("description")}</strong>
          <span className="text-sm">{look?.data.translation?.description}</span>
          {productList && productList?.length > 0 && (
            <div className="mt-6">
              <Button onClick={handleInsertToCart} loading={isInserting} className="black">
                {t("add.to.cart")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
