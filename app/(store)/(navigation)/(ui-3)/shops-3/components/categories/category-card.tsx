import { Category } from "@/types/category";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  data: Category;
}

export const CategoryCard = ({ data }: CategoryCardProps) => (
  <Link href={`/products?categories=${data.id}`}>
    <div
      className={clsx(
        " bg-gray-segment dark:bg-gray-inputBorder rounded-2xl aspect-square gap-4 md:pt-6 md:pl-5 pt-4 pl-4 max-h-[120px] md:max-h-none w-full"
      )}
    >
      <span className={clsx("font-semibold text-sm md:text-xl text-start relative z-[1]")}>
        {data.translation?.title}
      </span>
      <div className="absolute bottom-0 right-0 aspect-square w-auto h-[70%]">
        <Image
          src={data.img || ""}
          alt={data.translation?.title || "category"}
          fill
          className="object-contain "
        />
      </div>
    </div>
  </Link>
);
