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
    <div className="xl:container px-2 md:px-4">
      <div className="relative md:h-[350px] h-60 w-full rounded-3xl overflow-hidden flex flex-col justify-end lg:pb-7 lg:px-7 md:pb-4 md:px-4 pb-2 px-2 store-bg">
        <Image
          src={shop.data.background_img}
          alt={shop.data.translation?.title || ""}
          fill
          className="object-cover z-[-1]"
        />
        <div className="flex items-center justify-between z-[1] mb-3">
          <h1 className="text-3xl font-bold z-[1] text-white ">{shop.data.translation?.title}</h1>
          {shop?.data.socials?.length !== 0 && <ShopSocials list={shop?.data.socials} />}
        </div>
        <div className="flex items-center justify-between z-[1]">
          <ShopWorkingDay workindDays={shop.data.shop_working_days} avgRating={shop?.data?.r_avg} />
          <ShopReview id={Number(params.id)} />
        </div>
      </div>
      <section className="mt-4 mb-2">
        <SlidableProductList
          title="top.sales"
          visibleListCount={6}
          params={{ shop_id: shop.data.id, column: "od_count", sort: "desc", lang }}
          link="/products"
        />
      </section>
      <section className="mt-4 mb-4">
        <SlidableProductList
          title="new.arrivals"
          visibleListCount={6}
          params={{ shop_id: shop.data.id, column: "id", sort: "desc", lang }}
          link="/products"
        />
      </section>
      <PersonalChat sellerId={shop?.data?.user_id} />
    </div>
  );
};

export default SingleShop;
