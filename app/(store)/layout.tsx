import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import React from "react";
import { Header } from "./components/header";

const PushNotification = dynamic(() =>
  import("@/components/push-notification").then((component) => ({
    default: component.PushNotification,
  }))
);

const StoreLayout = async ({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const isAuthenticated = cookies().has("token");
  return (
    <>
      <Header settings={settings?.data} />
      {detail}
      {children}
      {isAuthenticated && <PushNotification />}
    </>
  );
};

export default StoreLayout;
