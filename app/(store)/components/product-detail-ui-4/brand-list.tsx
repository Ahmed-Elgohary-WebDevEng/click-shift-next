"use client";

import Image from "next/image";
import React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";
import { extractDataFromPagination } from "@/utils/extract-data";
import Link from "next/link";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";

const BrandList = () => {
  const { t } = useTranslation();
  const { data } = useInfiniteQuery({
    queryKey: ["brandList"],
    queryFn: ({ pageParam }) => brandService.getAll({ page: pageParam, perPage: 18 }),
    suspense: true,
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const brandList = extractDataFromPagination(data?.pages);
  return (
    <div className="lg:mt-7 md:mt-4 mt-2 rounded-xl bg-white dark:bg-darkBgUi3 md:p-4 p-2.5">
      <ListHeader title={t("popular.brands")} link="/main" />
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 md:gap-4 gap-2">
        {brandList?.map((brand) => (
          <Link href={`/products?brands=${brand.id}`} key={brand.id}>
            <div className="border relative border-gray-border dark:border-gray-inputBorder rounded-xl px-2 flex justify-center items-center md:aspect-[100/24] aspect-[74/20] ">
              <div className="my-5">
                <Image
                  src={brand.img}
                  alt="brand"
                  fill
                  className="object-contain w-auto grayscale hover:grayscale-0"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandList;
