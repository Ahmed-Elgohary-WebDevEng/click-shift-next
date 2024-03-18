"use client";

import React, { useState } from "react";
import StoreIcon from "@/assets/icons/store";
import ShelfIcon from "@/assets/icons/shelf";
import { m } from "framer-motion";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import useSettingsStore from "@/global-store/settings";
import { CategoryFilter } from "../category-filter";

const tabs = [
  {
    value: "stores",
    icon: <StoreIcon />,
  },
  {
    value: "categories",
    icon: <ShelfIcon />,
  },
];

const ShopList = dynamic(() => import("../shop-list"), {
  ssr: false,
  loading: () => (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-7 gap-4 animate-pulse my-7">
      {Array.from(Array(10).keys()).map((item) => (
        <div key={item} className="aspect-[450/260] bg-gray-300 rounded-3xl" />
      ))}
    </div>
  ),
});
const CategoryList = dynamic(() => import("../category-list"), {
  ssr: false,
  loading: () => (
    <div className="grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-7 sm:gap-4 gap-2 animate-pulse my-7">
      {Array.from(Array(10).keys()).map((item) => (
        <div key={item} className="aspect-[1/1.5] bg-gray-300 rounded-3xl" />
      ))}
    </div>
  ),
});

const list = {
  stores: <ShopList />,
  categories: <CategoryList />,
};

export const HomeList = () => {
  const searchParams = useSearchParams();
  const settings = useSettingsStore((state) => state.settings);
  const [selectedTab, setSelectedTab] = useState(searchParams.get("type") || tabs[0].value);
  const { t } = useTranslation();
  const { setQueryParams } = useQueryParams({ scroll: false });
  const handleChangeTab = (tab: string) => {
    setSelectedTab(tab);
    setQueryParams({ type: tab }, false);
  };
  return (
    <section className="xl:container px-2 md:px-4">
      <div
        className={clsx(
          (settings?.ui_type === "3" || settings?.ui_type === "4") &&
            "px-3 py-3 bg-white dark:p-0 dark:bg-transparent rounded-xl mb-4"
        )}
      >
        <CategoryFilter
          extra={
            <div className="bg-gray-segment dark:bg-gray-darkSegment rounded-lg p-2 flex items-center">
              {tabs.map((tab) => (
                <button
                  onClick={() => handleChangeTab(tab.value)}
                  className={clsx(
                    "inline-flex text-sm relative z-[1] py-2 md:px-8 items-center gap-2 rounded-lg capitalize flex-1 justify-center px-4",
                    tab.value === selectedTab ? "text-black dark:text-white" : "text-gray-field"
                  )}
                  key={tab.value}
                >
                  {tab.icon}
                  {tab.value}
                  {tab.value === selectedTab ? (
                    <m.div
                      className="bg-white dark:bg-dark rounded-lg -z-[1] absolute top-0 left-0 w-full h-full"
                      layoutId="underline"
                    />
                  ) : null}
                </button>
              ))}
            </div>
          }
        />
        <div className="my-10">
          <span className="font-semibold capitalize mb-6 md:text-[26px] text-xl">
            {t(selectedTab)}
          </span>
          {list[selectedTab as keyof typeof setSelectedTab]}
        </div>
      </div>
    </section>
  );
};
