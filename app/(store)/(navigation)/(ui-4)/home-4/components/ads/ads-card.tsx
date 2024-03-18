import React from "react";

import { Ad } from "@/types/ads";
import "swiper/css/navigation";
import Link from "next/link";
import { ImageWithFallBack } from "@/components/image";
import clsx from "clsx";

interface AdsCardProps {
  data: Ad;
  big: boolean;
}

export const AdsCard = ({ data, big }: AdsCardProps) => (
  <Link
    href={`/promotion/${data.id}`}
    className={clsx(
      "relative bg-gray-ad rounded-lg overflow-hidden flex items-end h-[320px]",
      big && "col-span-2"
    )}
  >
    <ImageWithFallBack
      src={data.galleries?.[0].preview || data.galleries?.[0]?.path || ""}
      alt={data.translation?.title || "looks"}
      className="object-cover"
      fill
    />
  </Link>
);
