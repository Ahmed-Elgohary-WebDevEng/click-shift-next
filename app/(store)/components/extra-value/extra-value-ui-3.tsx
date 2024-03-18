"use client";

import DoubleCheckIcon from "@/assets/icons/double-check";
import { ExtraValue as ExtraValueType } from "@/types/product";
import clsx from "clsx";
import React from "react";
import Image from "next/image";

interface ExtraValueProps {
  data: ExtraValueType;
  selected?: boolean;
  group: string;
  onClick: () => void;
}

export const ExtraValueUi3 = ({ data, selected, group, onClick }: ExtraValueProps) => {
  if (group === "color") {
    if (!data.img) {
      return (
        <button
          onClick={onClick}
          style={{ backgroundColor: data.value }}
          className={clsx(
            "w-11 h-11 rounded-2xl flex items-center justify-center",
            data.value === "#ffffff" ? "text-dark  border border-gray-layout" : "text-white",
            data.value === "#000000" && "border border-gray-layout"
          )}
        >
          {selected && <DoubleCheckIcon />}
        </button>
      );
    }
    return (
      <button
        onClick={onClick}
        className={clsx(selected && "ring-2 ring-primary ", "rounded-2xl  p-2")}
      >
        <Image
          src={data.img}
          alt={data.value}
          width={94}
          height={74}
          className="rounded-2xl object-contain h-auto w-[94px] aspect-square"
        />
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={clsx(
        "py-3 px-4 rounded-2xl flex items-center justify-center border  text-sm",
        selected
          ? "border-dark dark:border-white"
          : "border-gray-border dark:border-gray-darkSegment"
      )}
    >
      {data?.value}
    </button>
  );
};
