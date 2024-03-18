import React from "react";

import { Ad } from "@/types/ads";
import { MediaRender } from "@/components/media-render";
import "swiper/css/navigation";
import Link from "next/link";

interface AdsCardProps {
  data: Ad;
}

export const AdsCard = ({ data }: AdsCardProps) => (
  <div className="grid lg:grid-cols-6 md:gap-7 gap-4 relative">
    <Link
      href={`/promotion/${data.id}`}
      className="md:p-10 sm:p-5 p-3 lg:col-span-2 bg-primary rounded-xl bg-curve-pattern bg-no-repeat bg-cover lg:aspect-auto sm:aspect-[2/1] aspect-square"
    >
      <div className="flex flex-col gap-2">
        <span className="lg:text-7xl text-5xl font-semibold text-white hover:underline">
          {data.translation?.title}
        </span>
      </div>
    </Link>
    <div className="h-full relative md:aspect-[2/1] aspect-[345/268] rounded-xl overflow-hidden lg:col-span-4">
      <MediaRender
        src={data.galleries?.[0]?.path || ""}
        preview={data.galleries?.[0]?.preview}
        alt={data.translation?.title || "looks"}
        className="object-cover"
        fill
      />
    </div>
  </div>
);
