import { useTranslation } from "react-i18next";
import clsx from "clsx";
import React from "react";
import Link from "next/link";
import { Banner } from "@/types/banner";
import Image from "next/image";

interface LookAndProductProps {
  look?: Banner;
}

export const LookCard = ({ look }: LookAndProductProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "xl:col-span-2 md:col-span-2 sm:col-span-2  col-span-2 rounded-xl overflow-hidden relative aspect-[315/414] sm:aspect-[360/410] lg:aspect-square xl:aspect-auto"
      )}
    >
      <Image
        src={look?.galleries?.[0]?.preview || look?.img || ""}
        alt={look?.translation?.title || "look"}
        fill
        className="object-cover "
      />
      <div className="flex flex-col justify-end items-start gap-3 absolute w-full h-full z-[2]  md:py-10 md:px-7 px-6 pb-4 card-overlay2 ">
        <div className="mb-6">
          <Link
            className="text-sm font-medium border border-white text-white md:rounded-lg rounded-2xl py-2.5 px-7 max-h-max"
            replace
            href={{ query: { looksId: look?.id } }}
            scroll={false}
          >
            {t("shop.now")}
          </Link>
        </div>
        <span className="font-semibold md:text-3xl text-2xl text-white uppercase line-clamp-1">
          {look?.translation?.title}
        </span>
      </div>
    </div>
  );
};
