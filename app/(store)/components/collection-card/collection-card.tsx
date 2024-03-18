import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

interface CollectionCardProps {
  title: string;
  description?: string;
  img: string;
  productsCount: number;
}

export const CollectionCard = ({ img, title, description, productsCount }: CollectionCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="aspect-square rounded-[25px] overflow-hidden relative flex items-end lg:p-[30px] md:p-4 p-2 ">
      <div className="absolute top-2 right-2 md:top-3 md:right-3 rounded-full px-3 py-2 bg-white bg-opacity-10 backdrop-blur-md z-[2] dark:bg-dark dark:bg-opacity-30">
        <span className="text-base font-medium">
          {productsCount} {productsCount > 1 ? t("products") : t("product")}
        </span>
      </div>
      <div className="overlay-bg w-full h-full absolute inset-0 z-[1] transition-all" />
      <Image src={img} alt="object" fill className="object-cover" />
      <div className="flex flex-col relative z-[2] select-none">
        <strong className="md:text-3xl text-xl font-semibold text-white">{title}</strong>
        <span className="md:text-xl text:sm text-white">{description}</span>
      </div>
    </div>
  );
};
