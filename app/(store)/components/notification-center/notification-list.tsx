import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification";
import { NotificationCard } from "@/app/(store)/components/notification-center/notification-card";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import dynamic from "next/dynamic";
import useUserStore from "@/global-store/user";
import useSettingsStore from "@/global-store/settings";

interface NotificationListProps {
  type: string;
}

const NotificationEmptyList = dynamic(() =>
  import("./notification-empty-list").then((component) => ({
    default: component.NotificationEmptyList,
  }))
);

export const NotificationList = ({ type }: NotificationListProps) => {
  const user = useUserStore((state) => state.user);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const {
    data: notifications,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["notifications", type, language?.locale],
    ({ pageParam = 1 }) =>
      notificationService.getAll({
        type,
        column: "id",
        sort: "desc",
        perPage: 4,
        page: pageParam,
        lang: language?.locale,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      enabled: !!user,
    }
  );
  const notificationList = extractDataFromPagination(notifications?.pages);

  if ((notificationList && notificationList?.length === 0) || !user) {
    return <NotificationEmptyList />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-32" />
        <div className="bg-gray-200 rounded-xl h-32" />
        <div className="bg-gray-200 rounded-xl h-32" />
      </div>
    );
  }

  return (
    <div className="md:max-h-[500px] sm:max-h-[400px] max-h-[350px] overflow-y-auto">
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="flex flex-col gap-2.5 pb-10">
          {notificationList?.map((notification) => (
            <NotificationCard key={notification.id} data={notification} />
          ))}
        </div>
      </InfiniteLoader>
    </div>
  );
};
