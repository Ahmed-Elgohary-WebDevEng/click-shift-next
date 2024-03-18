"use client";

import { Paginate } from "@/types/global";
import { Faq } from "@/types/info";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { infoService } from "@/services/info";
import { Qa } from "@/app/(store)/(settings)/help/components/qa";
import React from "react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";

interface HelpContentProps {
  data: Paginate<Faq>;
}

export const HelpContent = ({ data }: HelpContentProps) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const {
    data: faqs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["faq", language?.locale],
    ({ pageParam }) => infoService.faq({ lang: language?.locale, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      initialData: { pages: [data], pageParams: [1] },
    }
  );

  const faqList = extractDataFromPagination(faqs?.pages);

  return (
    <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
      <div className="flex flex-col gap-2 w-full">
        {faqList?.map((faq) => (
          <Qa data={faq} key={faq.id} />
        ))}
      </div>
    </InfiniteLoader>
  );
};
