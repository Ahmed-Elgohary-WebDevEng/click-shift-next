import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import AuthHeader from "./header";

export default async ({ children }: { children: React.ReactNode }) => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <AuthHeader settings={parsedSettings} />
      <main className="auth-body md:mx-4 mx-2 sm:bg-auth-pattern bg-cover bg-no-repeat flex items-center justify-center ">
        <div className="bg-white dark:bg-dark dark:bg-opacity-50 bg-opacity-80 backdrop-blur-lg rounded-3xl sm:min-w-[450px] sm:max-w-[450px] w-full">
          {children}
        </div>
      </main>
    </>
  );
};
