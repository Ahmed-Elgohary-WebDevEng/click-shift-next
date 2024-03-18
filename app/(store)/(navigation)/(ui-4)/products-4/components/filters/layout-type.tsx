"use client";

import React from "react";
import Column2Icon from "@/assets/icons/column2";
import Column3Icon from "@/assets/icons/column3";
import Row2Icon from "@/assets/icons/row2";
import SquareIcon from "@/assets/icons/square";
import useFilterStore from "@/global-store/filter";
import clsx from "clsx";
import { FilterWrapper } from "./filter-wrapper";

const variants = [
  {
    icon: <Column2Icon />,
    value: "2",
  },
  {
    icon: <Column3Icon />,
    value: "1",
  },
  {
    icon: <Row2Icon />,
    value: "3",
  },
  {
    icon: <SquareIcon />,
    value: "4",
  },
];

export const LayoutType = () => {
  const productVariant = useFilterStore((state) => state.productVariant);
  const updateProductVariant = useFilterStore((state) => state.updateProductVariant);
  return (
    <FilterWrapper title="layouts">
      <div className="flex items-center justify-between">
        {variants.map((variant) => (
          <button
            key={variant.value}
            onClick={() => updateProductVariant(variant.value)}
            className={clsx(
              "text-gray-layout hover:text-primary max-w-max",
              variant.value === productVariant && "text-primary"
            )}
          >
            {variant.icon}
          </button>
        ))}
      </div>
    </FilterWrapper>
  );
};
