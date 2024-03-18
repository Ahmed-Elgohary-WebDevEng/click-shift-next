"use client";

import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import { Checkbox } from "./checkbox";
import { ExpandableFilterWrapper } from "./expandable-fileter-wrapper";

interface CheckboxFilterProps<T> {
  title: string;
  values?: T[];
  keyExtractor: (item: T) => string | number;
  valueExtractor: (item: T) => string | number;
  labelExtractor: (item: T) => string;
  queryKey?: string;
}

export const CheckboxFilter = <T,>({
  title,
  values,
  keyExtractor,
  valueExtractor,
  labelExtractor,
  queryKey,
}: CheckboxFilterProps<T>) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const selectedItems = searchParams.getAll(queryKey || title);
  const { setQueryParams } = useQueryParams();
  return (
    <ExpandableFilterWrapper
      title={title || ""}
      subTitle={`${searchParams.getAll(queryKey || title).length} ${t("selected")}`}
    >
      {values?.map((item, i) => (
        <div
          key={keyExtractor(item)}
          className={clsx(
            "py-4",
            i !== values.length - 1 && "border-b border-gray-border dark:border-gray-bold"
          )}
        >
          <Checkbox
            onChange={(e) => setQueryParams({ [queryKey || title]: e.target.value })}
            value={valueExtractor(item)}
            label={labelExtractor(item)}
            defaultChecked={selectedItems.includes(valueExtractor(item).toString())}
          />
        </div>
      ))}
    </ExpandableFilterWrapper>
  );
};
