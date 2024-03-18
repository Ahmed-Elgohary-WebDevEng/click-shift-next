import { ProductFull } from "@/types/product";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";

export const ProductProperties = ({ data }: { data?: ProductFull }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      <div className="font-semibold text-lg mb-5">{t("description")}</div>
      <span className="text-base">{data?.translation?.description}</span>
      {data?.properties && data.properties.length !== 0 && (
        <div>
          <div className="font-semibold text-lg mb-5 mt-10">{t("specification")}</div>
          <div className=" flex flex-col">
            {data?.properties?.map((property) => (
              <div
                className={clsx(
                  "flex justify-between items-center py-4 border-b border-gray-border dark:border-gray-inputBorder"
                )}
                key={property.id}
              >
                <span className="text-sm">{property.group?.translation?.title}</span>
                <span className="text-sm">{property.value?.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
