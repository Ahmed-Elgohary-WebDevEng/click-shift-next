"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import useSettingsStore from "@/global-store/settings";
import { extractDataFromPagination } from "@/utils/extract-data";
import Link from "next/link";
import { ListHeader } from "@/components/list-header/list-header";
import clsx from "clsx";
import { LooksCard } from "./looks-card";

export const Looks = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data } = useInfiniteQuery(
    ["looks", "4"],
    ({ pageParam }) =>
      bannerService.getAll({
        page: pageParam,
        lang: language?.locale,
        type: "look",
        perPage: 4,
      }),
    {
      suspense: true,
    }
  );
  const looksList = extractDataFromPagination(data?.pages);
  if (looksList && looksList.length === 0) {
    return null;
  }
  return (
    <div className="my-7">
      <ListHeader title="looks" link={looksList && looksList.length > 0 ? "/looks" : undefined} />
      <div className="grid lg:grid-cols-7 md:grid-rows-2 md:grid-cols-2 grid-cols-1 gap-[30px] mt-7">
        {looksList?.map((look, idx) => (
          <Link
            scroll={false}
            className={clsx(
              idx === 0 && "md:col-span-2 md:row-span-2",
              idx === 1 && "lg:col-span-3 lg:col-start-3",
              idx === 2 && "lg:col-span-3 lg:col-start-3 ",
              idx === 3 && "lg:col-span-2 lg:row-span-2 lg:col-start-6 lg:row-start-1"
            )}
            replace
            href={{ query: { looksId: look.id } }}
            key={look.id}
          >
            <LooksCard
              productsCount={look.products_count}
              title={look.translation?.title || ""}
              img={look.img}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
