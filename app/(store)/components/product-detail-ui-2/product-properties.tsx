import { ProductFull } from "@/types/product";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

const SuggestionList = dynamic(() => import("../suggestion"));

export const ProductProperties = ({ data }: { data?: ProductFull }) => {
  const { t } = useTranslation();
  const halfProperties = data?.properties.slice(0, Math.floor(data.properties.length / 2));
  const secondHalfProperties = data?.properties.slice(Math.floor(data.properties.length / 2));
  return (
    <div className="grid grid-cols-7 gap-7 mt-10">
      <div className="xl:col-span-5 lg:col-span-4  col-span-7">
        <div className="font-semibold text-lg mb-5">{t("description")}</div>
        <span className="text-base">{data?.translation?.description}</span>
        <div className="font-semibold text-lg mb-5 mt-10">{t("specification")}</div>
        <div className="grid sm:grid-cols-2 sm:gap-7 gap-2">
          {halfProperties?.length !== 0 && (
            <div className="border border-gray-border dark:border-gray-bold sm:py-10 sm:px-5 py-4 px-2 rounded-2xl flex flex-col">
              {halfProperties?.map((property) => (
                <div className={clsx("flex justify-between items-center py-4")} key={property.id}>
                  <span className="text-sm">{property.group?.translation?.title}</span>
                  <span className="text-sm">{property.value?.value}</span>
                </div>
              ))}
            </div>
          )}
          {secondHalfProperties && secondHalfProperties?.length > 0 && (
            <div className="border border-gray-border sm:py-10 sm:px-5 py-4 px-2 rounded-2xl flex flex-col dark:border-gray-bold">
              {secondHalfProperties?.map((property) => (
                <div className={clsx("flex justify-between items-center py-4")} key={property.id}>
                  <span className="text-sm">{property?.group?.translation?.title}</span>
                  <span className="text-sm">{property.value.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="xl:col-span-2 lg:col-span-3 col-span-7">
        <SuggestionList />
      </div>
    </div>
  );
};
