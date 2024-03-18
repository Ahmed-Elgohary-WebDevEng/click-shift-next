import { useTranslation } from "react-i18next";
import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { Banner } from "@/types/banner";
import Image from "next/image";

interface LookAndProductProps {
  look?: Banner;
}

export const LookAndProducts = ({ look }: LookAndProductProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "xl:col-span-2 md:col-span-4 sm:col-span-3  col-span-2 rounded-xl overflow-hidden md:py-10 md:px-7 px-6 pt-16 relative card-overlay aspect-[315/414] sm:aspect-[360/410] lg:aspect-square xl:aspect-auto"
      )}
    >
      <Image
        src={look?.galleries?.[0]?.preview || look?.img || ""}
        alt={look?.translation?.title || "look"}
        fill
        className="object-cover z-[-1]"
      />
      <div className="flex flex-col justify-center items-center gap-3">
        <span className="font-semibold md:text-3xl text-2xl text-white">
          {look?.translation?.title}
        </span>
        <span className="md:text-base text-sm font-medium line-clamp-2 text-white">
          {look?.translation?.description}
        </span>
        <div className="mt-7">
          <Link
            className="text-base font-medium border border-white text-white md:rounded-lg rounded-2xl py-4 px-8 max-h-max"
            replace
            href={{ query: { looksId: look?.id } }}
            scroll={false}
          >
            {t("shop.now")}
          </Link>
        </div>
      </div>
    </div>
  );
};
