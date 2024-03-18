"use client";

import { Stock } from "@/types/product";
import { useMemo } from "react";
import { groupExtrasToCompare } from "@/utils/group-extras-to-compare";
import { CompareAccordion } from "@/app/(store)/(navigation)/compare/components/accordion";
import { CompareExtraValue } from "@/app/(store)/(navigation)/compare/components/extra-value";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { useTranslation } from "react-i18next";

interface CompareMainInfoProps {
  stocks?: Stock[];
  productIds?: number[];
  productMainInfo: Record<
    number,
    {
      category: Category | null;
      brand: Brand | null;
    }
  >;
}

export const MainInfo = ({
  stocks,
  productIds,

  productMainInfo,
}: CompareMainInfoProps) => {
  const { t } = useTranslation();
  const groupedExtras = useMemo(() => groupExtrasToCompare(stocks), [stocks]);
  const noInfo = t("no.info");

  return (
    <CompareAccordion title="main.info">
      <div className="flex items-center gap-7 border-t border-gray-border py-2.5 dark:border-gray-bold overflow-x-auto">
        <div>
          <span className="text-sm text-gray-field font-medium">{t("category")}</span>
          <div className="flex items-center gap-7 mt-2">
            {productIds?.map((productId) => (
              <div
                className="max-w-compareWidth w-[200px] flex items-center gap-2 flex-wrap"
                key={productId}
              >
                <span className="text-base font-medium">
                  {productMainInfo?.[productId]?.category?.translation?.title || noInfo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-7 border-t border-gray-border py-2.5 dark:border-gray-bold overflow-x-auto">
        <div>
          <span className="text-sm text-gray-field font-medium">{t("brand")}</span>
          <div className="flex items-center gap-7 mt-2">
            {productIds?.map((productId) => (
              <div
                className="max-w-compareWidth w-[200px] flex items-center gap-2 flex-wrap"
                key={productId}
              >
                <span className="text-base font-medium">
                  {productMainInfo?.[productId]?.brand?.title || noInfo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {groupedExtras?.map((groupedExtra) => (
        <div
          className="flex items-center gap-7 border-t border-gray-border py-2.5 dark:border-gray-bold overflow-x-auto"
          key={groupedExtra.group.id}
        >
          <div>
            <span className="text-sm text-gray-field font-medium">
              {groupedExtra?.group?.translation?.title}
            </span>
            <div className="flex items-center gap-7 mt-2">
              {productIds?.map((productId) => (
                <div
                  className="max-w-compareWidth w-[200px] flex items-center gap-2 flex-wrap"
                  key={productId}
                >
                  {groupedExtra.values?.[productId]?.map((extraValue) => (
                    <CompareExtraValue
                      data={extraValue}
                      group={groupedExtra?.group?.type}
                      key={extraValue.id}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </CompareAccordion>
  );
};
