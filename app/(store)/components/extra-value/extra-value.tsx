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

export const ExtraValue = ({ data, selected, group, onClick }: ExtraValueProps) => {
  if (group === "color") {
    if (!data.img) {
      return (
        <button
          onClick={onClick}
          style={{ backgroundColor: data.value }}
          className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center",
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
        className={clsx(selected && "ring-2 ring-primary", "rounded-md  p-0.5")}
      >
        <Image
          src={data.img}
          alt={data.value}
          width={40}
          height={60}
          className="rounded-md object-contain h-14 w-auto max-w-10 aspect-[1/1.5]"
        />
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={clsx(
        "py-1.5 px-3 rounded-lg flex items-center justify-center border border-gray-layout dark:border-gray-darkSegment text-gray-field",
        selected && "bg-primary border-none text-white"
      )}
    >
      {data?.value}
    </button>
  );
};
