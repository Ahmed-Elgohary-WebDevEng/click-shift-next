import { Shop } from "@/types/shop";
import React from "react";
import Link from "next/link";
import { Translate } from "@/components/translate";
import { ImageWithFallBack } from "@/components/image";
import { Button } from "../button";
import { ShopWorkingDay } from "../shop-working-day";

interface ShopCardProps {
  data: Shop;
}

export const ShopCard = ({ data }: ShopCardProps) => (
  <Link href={`/shops/${data.id}`}>
    <div className="relative rounded-xl overflow-hidden aspect-[450/250] flex flex-col justify-end group">
      <ImageWithFallBack
        src={data.background_img}
        alt={data.translation?.title || ""}
        fill
        className="object-cover transition-all group-hover:scale-105 "
      />
      <div className="absolute w-full h-full store-bg z-[1]" />
      <div className="flex flex-col gap-3 z-[2] xl:pb-5 xl:px-5 lg:pb-3 lg:px-3 pb-2 px-1">
        <Link href={`/shops/${data.id}`} className="text-2xl font-semibold text-white">
          {data.translation?.title}
        </Link>
        <div className="flex items-center gap-2.5">
          <ShopWorkingDay workindDays={data.shop_working_days} avgRating={data.r_avg} />
          <Button
            size="xsmall"
            scroll={false}
            rounded
            replace
            as={Link}
            href={{ query: { shop_id: data.id } }}
          >
            <Translate value="see.reviews" />
          </Button>
        </div>
      </div>
    </div>
  </Link>
);
