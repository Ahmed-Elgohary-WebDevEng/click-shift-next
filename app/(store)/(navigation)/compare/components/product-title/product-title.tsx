import { Product } from "@/types/product";
import useCompareStore from "@/global-store/compare";
import { IconButton } from "@/components/icon-button";
import TrashIcon from "@/assets/icons/trash";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const ProductTitle = ({ data }: { data: Product }) => {
  const deleteFromList = useCompareStore((state) => state.addOrRemove);

  return (
    <div className="max-w-compareWidth min-w-[200px] w-[200px] group overflow-x-auto">
      <div className="w-20 h-20 relative">
        <div className="absolute right-0 top-0 z-[2]">
          <IconButton rounded onClick={() => deleteFromList(data.id)}>
            <TrashIcon />
          </IconButton>
        </div>
        <Image
          src={data.img}
          alt={data.translation?.title || "product"}
          fill
          className="object-contain"
        />
      </div>

      <Link
        href={`/products/${data.uuid}`}
        className="text-base whitespace-nowrap font-medium hover:underline line-clamp-2 mt-1"
      >
        {data.translation?.title}
      </Link>
    </div>
  );
};
