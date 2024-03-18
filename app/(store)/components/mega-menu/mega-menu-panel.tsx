import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import { InfiniteLoader } from "@/components/infinite-loader";
import { MenuButton } from "@/app/(store)/components/mega-menu/menu-button";
import { MenuItem } from "@/app/(store)/components/mega-menu/menu-item";
import React, { useState } from "react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Category } from "@/types/category";
import useSettingsStore from "@/global-store/settings";

const MegaMenuPanel = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data, hasNextPage, isFetching, fetchNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["categories", "main"],
    queryFn: ({ pageParam }) =>
      categoryService.getAll({ page: pageParam, type: "main", lang: language?.locale }),
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const categories = extractDataFromPagination(data?.pages);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  return (
    <div className="relative grid gap-10 lg:grid-cols-5">
      <div className="flex flex-col border-r gap-2 border-gray-border dark:border-gray-bold pr-2.5 min-h-screen pt-2">
        {isLoading ? (
          <>
            <div className="bg-gray-300 rounded-xl h-8" />
            <div className="bg-gray-300 rounded-xl h-8" />
            <div className="bg-gray-300 rounded-xl h-8" />
            <div className="bg-gray-300 rounded-xl h-8" />
          </>
        ) : (
          <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetching}>
            {categories?.map((category) => (
              <MenuButton
                key={category.id}
                selectedCategory={selectedCategory || categories.at(0)}
                category={category}
                onHover={(hoveredCategory) => setSelectedCategory(hoveredCategory)}
              />
            ))}
          </InfiniteLoader>
        )}
      </div>
      <div className="col-span-4">
        <h4 className="text-2xl font-semibold mb-8">
          {selectedCategory
            ? selectedCategory?.translation?.title
            : categories?.[0]?.translation?.title}
        </h4>
        <div className="grid grid-cols-3 gap-x-10 gap-y-5">
          {(selectedCategory || categories?.[0])?.children?.map((category) => (
            <MenuItem key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenuPanel;
