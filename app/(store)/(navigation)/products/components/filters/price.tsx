"use client";

import ReactSlider from "react-slider";
import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { generateRandomNumbers } from "@/utils/generate-random-numbers";
import { Price } from "@/components/price";
import { useQueryParams } from "@/hook/use-query-params";
import { useSearchParams } from "next/navigation";
import { FilterWrapper } from "./filter-wrapper";

interface PriceFilterProps {
  priceFromServer?: number;
  priceToServer?: number;
}

export const PriceFilter = ({ priceFromServer, priceToServer }: PriceFilterProps) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState([
    searchParams.has("priceFrom") ? Number(searchParams.get("priceFrom")) : 0,
    searchParams.has("priceTo") ? Number(searchParams.get("priceTo")) : 0,
  ]);
  const numberList = useMemo(() => generateRandomNumbers(30, 60), []);
  const { setQueryParams } = useQueryParams();

  useEffect(() => {
    if (!searchParams.has("priceFrom") && !searchParams.has("priceTo")) {
      setValue([priceFromServer || 0, priceToServer || 0]);
    }
  }, [priceFromServer, priceToServer]);

  return (
    <FilterWrapper title="price.ranges" subTitle={`$${value[0]} to $${value[1]} selected`}>
      <div className="flex items-end justify-between gap-1 mb-1">
        {numberList.map((number, i) => (
          <div
            key={number}
            style={{ height: `${number}px` }}
            className={clsx(
              "w-1.5 rounded-full",
              i <= Math.floor((value[1] * 30) / (priceToServer || 100)) &&
                i >= Math.ceil((value[0] * 30) / (priceToServer || 100)) &&
                "bg-primary"
            )}
          />
        ))}
      </div>
      <ReactSlider
        value={value}
        min={priceFromServer}
        max={priceToServer}
        onChange={(values) => {
          setValue(values);
        }}
        onAfterChange={(values) => {
          setQueryParams({ priceFrom: values[0], priceTo: values[1] }, false);
        }}
        className="mb-12"
        renderTrack={(props, state) => {
          const { key, ...otherProps } = props;
          return (
            <div
              key={key}
              {...otherProps}
              className={clsx(
                "h-1 top-[16px] -translate-y-[8px]",
                "rounded-full",
                state.index === 1
                  ? `bg-dark dark:bg-white top-[16px] relative`
                  : "bg-sliderTrack dark:bg-gray-darkSegment"
              )}
            />
          );
        }}
        renderThumb={(props, state) => {
          const { className, key, ...otherProps } = props;
          return (
            <div
              key={key}
              className={clsx(
                "w-5 h-5 rounded-full border-2 border-dark aspect-square bg-gray-100 flex justify-center items-center gap-1 focus-ring outline-none relative cursor-grab",
                className
              )}
              {...otherProps}
            >
              <div className="h-2 w-px bg-gray-300" />
              <div className="h-2 w-px bg-gray-300" />
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Price number={state.valueNow} />
              </div>
            </div>
          );
        }}
      />
    </FilterWrapper>
  );
};
