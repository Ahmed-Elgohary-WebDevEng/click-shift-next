import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

interface LooksCardProps {
  title: string;
  description?: string;
  img: string;
  productsCount: number;
}

export const LooksCard = ({ img, title, description, productsCount }: LooksCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full rounded-[25px] overflow-hidden relative flex lg:p-[30px] md:p-4 p-2 min-h-[260px]">
      <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 rounded-full px-3 py-2 bg-white bg-opacity-10 backdrop-blur-md z-[2] dark:bg-dark dark:bg-opacity-30">
        <span className="text-base font-medium">
          {productsCount} {productsCount > 1 ? t("products") : t("product")}
        </span>
      </div>
      <div className=" w-full h-full absolute inset-0 z-[1] transition-all" />
      <Image
        src={img}
        alt="object"
        fill
        className="object-cover"
        sizes="(max-width: 376px) 360px, (max-width: 576px) 560px, (max-width: 768px) 360px, (max-width: 992px) 465px, (max-width: 1200px) 480px, 620px"
      />
      <div className="flex flex-col relative z-[2] select-none">
        <strong className="md:text-3xl text-xl font-semibold ">{title}</strong>
        <span className="md:text-xl text-sm ">{description}</span>
      </div>
    </div>
  );
};
