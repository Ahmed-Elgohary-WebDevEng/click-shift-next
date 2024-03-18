"use client";

import { CollectionCard } from "@/app/(store)/components/collection-card";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import useSettingsStore from "@/global-store/settings";
import { extractDataFromPagination } from "@/utils/extract-data";
import Link from "next/link";
import { ListHeader } from "@/components/list-header/list-header";

export const Looks = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data } = useInfiniteQuery(
    ["looks"],
    ({ pageParam }) =>
      bannerService.getAll({
        page: pageParam,
        lang: language?.locale,
        type: "look",
        perPage: 3,
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
    <>
      <ListHeader title="looks" link={looksList && looksList.length > 0 ? "/looks" : undefined} />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-[30px] mt-7">
        {looksList?.map((look) => (
          <Link scroll={false} replace href={{ query: { looksId: look.id } }}>
            <CollectionCard
              productsCount={look.products_count}
              title={look.translation?.title || ""}
              img={look.img}
              key={look.id}
            />
          </Link>
        ))}
      </div>
    </>
  );
};
