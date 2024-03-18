import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { Category } from "@/types/category";
import ChevronRightIcon from "@/assets/icons/chevron-right";
import Image from "next/image";

interface CatalogButtonProps {
  onHover: (category: Category) => void;
  category: Category;
  selectedCategory?: Category;
}

export const MenuButton = ({ category, onHover, selectedCategory }: CatalogButtonProps) => (
  <Link
    href={`/products?categories=${category.id}`}
    onMouseEnter={() => onHover(category)}
    className={clsx(
      "group inline-flex items-center justify-between hover:text-text py-2.5 px-3 hover:bg-gray-segment dark:hover:bg-gray-darkSegment dark:hover:text-white rounded-2xl",
      selectedCategory?.id === category.id
        ? "bg-gray-segment text-text dark:bg-gray-darkSegment dark:text-white"
        : "text-text-light"
    )}
  >
    <div className="flex items-center gap-2.5">
      <Image
        src={category.img || ""}
        alt={category.translation?.title || "category"}
        width={24}
        height={24}
        className="w-6 h-6 object-contain"
      />
      <span className="text-base font-medium">{category.translation?.title}</span>
    </div>
    <span className="text-gray-field rtl:rotate-180">
      <ChevronRightIcon />
    </span>
  </Link>
);
