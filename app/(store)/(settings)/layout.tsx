import React from "react";
import dynamic from "next/dynamic";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import clsx from "clsx";
import { BackButton } from "../components/back-button";

const ProfileSidebar = dynamic(() => import("./sidebar"));
const MobileSidebar = dynamic(() => import("./mobile-sidebar"));

const SettingsLayout = async ({
  children,
  info,
}: {
  children: React.ReactNode;
  info: React.ReactNode;
}) => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  return (
    <main className="xl:container px-2 md:px-4">
      <div className="flex items-center justify-between">
        <BackButton />
        <MobileSidebar />
      </div>
      <div
        className={clsx(
          "flex gap-12 lg:mt-10 mt-4",
          (parsedSettings?.ui_type === "3" || parsedSettings?.ui_type === "4") && "gap-6 lg:mt-4"
        )}
      >
        <aside className="border-r border-gray-border dark:border-gray-bold min-h-[calc(100vh-174px)] hidden lg:block rtl:border-l rtl:border-r-0">
          <ProfileSidebar />
        </aside>
        {info}
        <div
          className={clsx(
            "pb-4 flex-1",
            (parsedSettings?.ui_type === "3" || parsedSettings?.ui_type === "4") &&
              "bg-white rounded-xl p-4 dark:bg-transparent dark:p-0"
          )}
        >
          {children}
        </div>
      </div>
    </main>
  );
};

export default SettingsLayout;
