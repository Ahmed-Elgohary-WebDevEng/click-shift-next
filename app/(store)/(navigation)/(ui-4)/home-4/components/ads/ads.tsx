"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { extractDataFromPagination } from "@/utils/extract-data";
import { adsService } from "@/services/ads";
import useAddressStore from "@/global-store/address";
import { useTranslation } from "react-i18next";
import { ListHeader } from "@/components/list-header/list-header";
import { AdsCard } from "./ads-card";

export const Ads = () => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { t } = useTranslation();
  const params = {
    lang: language?.locale,
    currency_id: currency?.id,
    country_id: country?.id,
    city_id: city?.id,
    perPage: 6,
  };
  const { data: ads } = useInfiniteQuery(
    ["ads", params],
    ({ pageParam }) =>
      adsService.getAll({
        ...params,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const adList = extractDataFromPagination(ads?.pages);
  if (adList && adList.length === 0) {
    return null;
  }
  return (
    <div className="lg:mb-7 mb-4 relative">
      <div className="bg-white dark:bg-darkBgUi3 md:py-7 md:px-7 px-3 py-4 rounded-lg relative">
        <ListHeader title={t("current.offers")} />
        <div className="grid md:grid-cols-4 grid-cols-2 lg:gap-7 md:gap-4 gap-2">
          {adList?.map((ad, idx) => (
            <AdsCard big={idx === 0 || idx === 4} key={ad.id} data={ad} />
          ))}
        </div>
      </div>
    </div>
  );
};
