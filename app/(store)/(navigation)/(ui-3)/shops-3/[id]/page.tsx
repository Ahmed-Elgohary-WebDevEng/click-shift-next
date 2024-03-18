import { ShopWorkingDay } from "@/components/shop-working-day";
import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";
import { Shop } from "@/types/shop";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
import { SlidableProductList } from "@/app/(store)/components/slidable-product-list";
import { LoadingCard } from "@/components/loading";
import { cookies } from "next/headers";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { categoryService } from "@/services/category";
import Link from "next/link";
import { PersonalChat } from "../components/personal-chat";
import { Categories } from "../components/categories";
import { Looks } from "../components/looks";
import { ShopSocials } from "../components/shop-socials";

const ShopReview = dynamic(() => import("../components/shop-review"), {
  loading: () => <LoadingCard />,
});

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const shop = await fetcher<DefaultResponse<Shop>>(
    buildUrlQueryParams(`v1/rest/shops/${params.id}`, { lang }),
    {
      cache: "no-cache",
      redirectOnError: true,
    }
  );

  return {
    title: shop.data.translation?.title,
    description: shop.data.translation?.description,
    openGraph: {
      images: {
        url: shop.data.logo_img,
      },
      title: shop.data.translation?.title,
      description: shop.data.translation?.description,
    },
  };
};

const categorySizes = ["col-span-2", "col-span-3", "col-span-5"];

const SingleShop = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const shop = await fetcher<DefaultResponse<Shop>>(
    buildUrlQueryParams(`v1/rest/shops/${params.id}`, { lang }),
    {
      cache: "no-cache",
    }
  );
  const categories = await categoryService.getAll({
    product_shop_id: params.id,
    type: "main",
    lang,
    perPage: 3,
  });

  const canShowCategoriesOnTop = categories.data && categories.data.length > 3;

  return (
    <div className="xl:container px-2 md:px-4">
      <div className={`grid ${canShowCategoriesOnTop ? "grid-cols-7 gap-7" : "grid-cols-1"}`}>
        <div
          className={`relative md:h-[350px] h-60 w-full rounded-xl overflow-hidden flex flex-col  lg:pb-7 lg:px-7 md:pb-4 md:px-4 pb-2 px-2 lg:pt-7 pt-2 ${
            canShowCategoriesOnTop ? "col-span-4" : ""
          }`}
        >
          <div className="absolute width-full h-full bg-dark bg-opacity-40 z-[1]" />
          <Image
            src={shop.data.background_img}
            alt={shop.data.translation?.title || ""}
            fill
            className="object-cover"
          />
          <div className="flex items-start justify-between z-[1]">
            <div>
              <h1 className="text-5xl font-semibold z-[1] text-white mb-3">
                {shop.data.translation?.title}
              </h1>
              <span className="text-2xl text-white line-clamp-2">
                {shop.data.translation?.description}
              </span>
            </div>

            <ShopWorkingDay
              workindDays={shop.data.shop_working_days}
              avgRating={shop?.data?.r_avg}
            />
          </div>
          <div className="absolute md:bottom-4 md:right-4 bottom-2 right-2 lg:bottom-7 lg:right-7 flex flex-col md:gap-3 gap-1">
            {shop?.data.socials?.length !== 0 && <ShopSocials list={shop?.data?.socials} />}
            <ShopReview id={Number(params.id)} />
          </div>
        </div>
        {canShowCategoriesOnTop && (
          <div className="col-span-3 grid grid-cols-5 gap-7 grid-rows-2">
            {categories.data.map((category, idx) => (
              <Link
                href={`/products/?categories=${category.id}`}
                key={category.id}
                className={categorySizes[idx]}
              >
                <div className="rounded-2xl relative w-full h-full bg-dark bg-opacity-40">
                  <Image
                    src={category.img || ""}
                    alt={category.translation?.title || ""}
                    fill
                    className="object-contain"
                  />
                  <span className="absolute bottom-5 left-5 text-2xl font-semibold text-white">
                    {category.translation?.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Categories shopId={shop?.data?.id} />
      <Looks shopId={shop?.data?.id} />
      <section className="mt-4 mb-4">
        <SlidableProductList
          roundedColors
          title="new.arrivals"
          visibleListCount={6}
          params={{ shop_id: shop.data.id, column: "id", sort: "desc", lang }}
          link="/products"
          productVariant="5"
        />
      </section>
      <section className="mt-4 mb-2 bg-white md:p-5 p-4 dark:bg-darkBgUi3 rounded-xl ">
        <SlidableProductList
          title="top.sales"
          visibleListCount={4}
          params={{ shop_id: shop?.data?.id, column: "od_count", sort: "desc", lang }}
          link="/products"
          productVariant="4"
          roundedColors
        />
      </section>
      <PersonalChat sellerId={shop?.data?.user_id} />
    </div>
  );
};

export default SingleShop;
