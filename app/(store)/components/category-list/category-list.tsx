import { CategoryCard } from "@/components/category-card";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useSearchParams } from "next/navigation";
import useSettingsStore from "@/global-store/settings";
import { Empty } from "@/components/empty";

const CategoryList = () => {
  const searchParams = useSearchParams();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["categories", searchParams.get("category_id")],
    queryFn: ({ pageParam }) =>
      categoryService.getAll({
        type: "sub_main",
        page: pageParam,
        parent_id: searchParams.get("category_id"),
        lang: language?.locale,
      }),
    suspense: true,
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const categoryList = extractDataFromPagination(data?.pages);
  if (categoryList && categoryList.length === 0) {
    return <Empty text="there.is.no.categories" />;
  }
  return (
    <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
      <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 md:gap-7 sm:gap-4 gap-2 mt-4">
        {categoryList?.map((category) => (
          <CategoryCard data={category} key={category.id} size="large" />
        ))}
      </div>
    </InfiniteLoader>
  );
};

export default CategoryList;
