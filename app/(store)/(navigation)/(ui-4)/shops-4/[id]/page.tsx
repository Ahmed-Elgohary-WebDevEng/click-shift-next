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
import { PersonalChat } from "../components/personal-chat";
import { ShopSocials } from "../components/shop-socials";

const ShopReview = dynamic(() => import("../components/shop-review"), {
  loading: () => <LoadingCard />,
});
const Products = dynamic(() => import("../../products-4/page"));

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

const SingleShop = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const shop = await fetcher<DefaultResponse<Shop>>(
    buildUrlQueryParams(`v1/rest/shops/${params.id}`, { lang }),
    {
      cache: "no-cache",
    }
  );

  return (
    <>
      <div className="xl:container px-2 md:px-4">
        <div className="md:relative  w-full gap-y-4 flex flex-col">
          <div className="relative md:h-[510px] h-96 rounded-lg overflow-hidden ">
            <Image
              src={shop.data.background_img}
              alt={shop.data.translation?.title || ""}
              fill
              quality={100}
              priority
              className="object-cover"
            />

            <div className="absolute w-full h-full bg-dark bg-opacity-40 z-[1]" />
          </div>
          <div className="z-[1] md:absolute top-10 right-10 bottom-10 md:bg-primary-ui4OpacityBg bg-primary-ui4PrimaryBoldBg md:w-[370px] rounded-lg py-10 px-7 flex flex-col">
            <div className="flex-1 flex flex-col gap-7 mb-7">
              <h1 className="text-5xl font-semibold z-[1] text-white mb-3 text-center">
                {shop.data.translation?.title}
              </h1>
              <div className="h-px bg-white w-full bg-opacity-20 " />
              <span className="text-sm text-white line-clamp-2">
                {shop.data.translation?.description}
              </span>
              <div className="flex items-center gap-2 flex-1">
                <ShopReview id={Number(params.id)} />
                {shop?.data.socials?.length !== 0 && <ShopSocials list={shop?.data.socials} />}
              </div>
            </div>

            <div className="mt-auto">
              <ShopWorkingDay
                workindDays={shop.data.shop_working_days}
                avgRating={shop?.data?.r_avg}
                dark
              />
            </div>
          </div>
        </div>
        <section className="mt-4 md:mb-5 mb-4 bg-white md:p-5 p-4 dark:bg-darkBgUi3 rounded-xl ">
          <SlidableProductList
            roundedColors
            title="new.arrivals"
            visibleListCount={5}
            params={{ shop_id: shop.data.id, column: "id", sort: "desc", lang }}
            link="/products"
            productVariant="6"
          />
        </section>
        <PersonalChat top sellerId={shop?.data?.user_id} />
      </div>
      <Products shopId={shop?.data?.id} />
    </>
  );
};

export default SingleShop;
