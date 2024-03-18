import React from "react";
import { useTranslation } from "react-i18next";
import { Banner } from "@/types/banner";
import Link from "next/link";
import { MediaRender } from "@/components/media-render";

interface LooksCardProps {
  data: Banner;
}

export const LooksCard = ({ data }: LooksCardProps) => {
  const { t } = useTranslation();

  return (
    <Link replace href={{ query: { looksId: data?.id } }} scroll={false}>
      <div className="lg:py-10 lg:px-7 md:py-6 py-4 px-4 bg-white dark:bg-darkBgUi3 rounded-xl">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="lg:text-4xl md:text-3xl text-xl font-semibold uppercase">
              {data.translation?.title}
            </h2>
            <span className="md:text-lg text-xs text-gray-field">
              {data.translation?.description}
            </span>
          </div>
          <div className="md:block hidden">
            <Link
              className="text-base font-medium rounded-xl border border-dark py-4 px-12 dark:border-white block"
              replace
              href={{ query: { looksId: data?.id } }}
              scroll={false}
            >
              {t("shop.now")}
            </Link>
          </div>
        </div>

        <div className="flex justify-end h-[282px]">
          <div className="relative h-full max-w-[440px] w-full">
            <MediaRender
              src={data.galleries?.[0]?.path || data.img || ""}
              alt={data.translation?.title || "looks"}
              preview={data.galleries?.[0]?.preview}
              fill
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
