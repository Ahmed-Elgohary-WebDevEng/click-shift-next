"use client";

import SearchIcon from "@/assets/icons/search";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { useDebounce } from "@/hook/use-debounce";
import useSearchHistoryStore from "@/global-store/search-history";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { IconButton } from "@/components/icon-button";
import clsx from "clsx";
import ArrowLeftLineIcon from "remixicon-react/ArrowLeftLineIcon";
import { useModal } from "@/hook/use-modal";
import { LoadingCard } from "@/components/loading";
import useSettingsStore from "@/global-store/settings";
import { usePathname } from "next/navigation";
import useAddressStore from "@/global-store/address";

const SearchHistory = dynamic(() => import("./search-history"), {
  loading: () => <LoadingCard />,
});
const SearchResults = dynamic(() => import("./search-results"));

interface SearchFieldProps {
  rounded?: boolean;
  withButton?: boolean;
  visibleOnMobile?: boolean;
  isInHeader?: boolean;
}

export const SearchField = ({
  rounded = true,
  withButton,
  visibleOnMobile = true,
  isInHeader = true,
}: SearchFieldProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, open, close] = useModal();
  const [pathname] = usePathname();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const addToHistoryList = useSearchHistoryStore((state) => state.addToList);
  const { data: searchResult, isLoading } = useQuery({
    queryFn: () =>
      productService.search({
        search: debouncedSearchQuery,
        lang: language?.locale,
        currency_id: currency?.id,
        country_id: country?.id,
        city_id: city?.id,
        region_id: country?.region_id,
      }),
    queryKey: ["search", debouncedSearchQuery, country?.id, city?.id],
    enabled: debouncedSearchQuery.length > 0,
  });
  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      addToHistoryList(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);
  useEffect(() => {
    close();
  }, [pathname]);
  return (
    <div className={clsx(!visibleOnMobile && "md:flex-1 relative ", visibleOnMobile && "mb-4")}>
      {isOpen && (
        // eslint-disable-next-line
        <div
          onClick={close}
          className="fixed inset-0 md:bg-black bg-white dark:bg-darkBg md:opacity-30 md:z-[3] z-30"
        />
      )}
      {isOpen && (
        <div className="md:hidden fixed bottom-4 left-4 z-40">
          <IconButton onClick={close} size="large" rounded color="gray" className="text-white">
            <ArrowLeftLineIcon />
          </IconButton>
        </div>
      )}
      <div className={clsx("relative group", !visibleOnMobile && "md:flex-1 ")}>
        <div>
          <input
            value={searchQuery}
            onClick={() => open()}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={clsx(
              "placeholder:text-gray-field transition-all text-sm py-3 outline-none border-gray-border dark:border-gray-bold border ",
              isOpen && "fixed block z-40 left-2 right-2",
              !isOpen && !visibleOnMobile && "hidden",
              visibleOnMobile && !isOpen && "w-full",
              rounded ? "rounded-full" : "rounded-xl",
              withButton
                ? "md:pr-10 pr-3 pl-2 rtl:md:pl-10 rtl:pl-3"
                : "md:pl-10 pl-3 rtl:md:pr-10 rtl:pr-3",
              !visibleOnMobile && " md:w-full md:left-0 md:relative md:z-[3] md:block",
              visibleOnMobile && isOpen && "top-2"
            )}
            placeholder={t("search.products")}
          />
          {!visibleOnMobile && !isInHeader && (
            <IconButton onClick={open} className={clsx("md:hidden")}>
              <SearchIcon size={24} />
            </IconButton>
          )}
        </div>

        <div
          className={clsx(
            "absolute z-[3] inset-y-0 dark:group-focus-within:text-white m-auto items-center max-w-max md:flex",
            !visibleOnMobile && "hidden",
            visibleOnMobile && withButton && "flex",
            withButton
              ? "right-1 rtl:left-1 top-1 bottom-1 rtl:right-auto bg-primary text-white rounded-xl aspect-square justify-center"
              : "left-3 rtl:right-3 rtl:left-auto  group-focus-within:text-black text-gray-field"
          )}
        >
          <SearchIcon size={24} />
        </div>
      </div>
      {isOpen && (
        <Transition
          as={Fragment}
          appear
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div
            className={clsx(
              "md:absolute fixed left-0 z-30 md:mt-0.5 mt-4 md:w-full w-screen bg-white bg-opacity-80 backdrop-blur-lg md:rounded-3xl md:dark:bg-black dark:bg-darkBg md:max-h-[500px] overflow-hidden",
              rounded ? "md:rounded-3xl" : "md:rounded-lg",
              visibleOnMobile && isOpen && "top-10"
            )}
          >
            {searchQuery.length < 1 ? (
              <SearchHistory onItemClick={(query) => setSearchQuery(query)} />
            ) : (
              <SearchResults onClose={close} isLoading={isLoading} data={searchResult?.data} />
            )}
          </div>
        </Transition>
      )}
    </div>
  );
};
