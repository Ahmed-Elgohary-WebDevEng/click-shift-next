import { Category } from "@/types/category";
import clsx from "clsx";
import Image from "next/image";
import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  data: Category;
}

export const CategoryCard = ({ data }: CategoryCardProps) => (
  <Link href={`/main?category_id=${data.id}&type=categories`}>
    <div
      className={clsx(
        "flex items-center bg-gray-card dark:bg-gray-inputBorder rounded-full px-1.5 py-1.5 gap-4"
      )}
    >
      <div className="relative aspect-square w-[70px] h-[70px]">
        <Image
          src={data.img || ""}
          alt={data.translation?.title || "category"}
          fill
          className="object-contain rounded-full"
          sizes="(max-width: 576px) 30px, (max-width: 768px) 40px, (max-width: 992px) 50px, (max-width: 1200px) 60px, 70px"
        />
      </div>
      <span className={clsx("font-medium text-sm text-start")}>{data.translation?.title}</span>
    </div>
  </Link>
);
