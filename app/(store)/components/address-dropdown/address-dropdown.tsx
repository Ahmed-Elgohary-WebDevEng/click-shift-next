"use client";

import AnchorDownIcon from "@/assets/icons/anchor-down";
import { NavigatorIcon } from "@/assets/icons/navigator";
import React, { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import useAddressStore from "@/global-store/address";
import { LoadingCard } from "@/components/loading";
import { IconButton } from "@/components/icon-button";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { redirect } from "next/navigation";
import LocationIcon from "@/assets/icons/location";
import useLikeStore from "@/global-store/like";

const CountrySelect = dynamic(() => import("@/components/country-select"), {
  loading: () => <LoadingCard />,
});

interface AddressDropdownProps {
  rounded?: boolean;
  onlyIcon?: boolean;
}

export const AddressDropdown = ({ rounded, onlyIcon }: AddressDropdownProps) => {
  const city = useAddressStore((state) => state.city);
  const country = useAddressStore((state) => state.country);
  const clearLikes = useLikeStore((state) => state.clear);
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!country && mounted) {
      redirect("/country-select");
    }
  }, [country, mounted]);
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Overlay className="fixed inset-0 bg-black opacity-30 z-20" />
          <Popover.Button as={Fragment}>
            {!onlyIcon ? (
              <div>
                <button
                  className={clsx(
                    "py-2.5 px-5 outline-none bg-gray-button dark:bg-gray-inputBorder focus-ring hover:brightness-95 transition-all active:brightness-100 hidden lg:inline-block md:min-w-[300px]",
                    rounded ? "rounded-full" : "rounded-[10px]"
                  )}
                >
                  <div className="flex items-center justify-between gap-10">
                    <div className="flex items-center gap-3">
                      <NavigatorIcon />
                      {mounted ? (
                        <span className="text-base font-medium">
                          {city?.translation?.title}
                          {city ? "," : ""} {country?.translation?.title}
                        </span>
                      ) : (
                        <div className="bg-gray-300 h-4 w-32 rounded-full" />
                      )}
                    </div>
                    <AnchorDownIcon />
                  </div>
                </button>
                <IconButton className="lg:hidden">
                  <NavigatorIcon size={24} />
                </IconButton>
              </div>
            ) : (
              <IconButton size="small">
                <LocationIcon />
              </IconButton>
            )}
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 sm:translate-y-1 translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 sm:translate-y-1 translate-y-full"
          >
            <Popover.Panel
              static
              className="sm:absolute fixed sm:bottom-auto bottom-0 right-0 z-30 mt-2 lg:w-full lg:max-w-sm sm:w-72 w-screen transform min-w-[250px]"
            >
              <div className="sm:rounded-3xl rounded-t-3xl px-3 pt-4 pb-4 md:px-5 md:pb-5 bg-white dark:bg-darkBg dark:ring-white">
                <CountrySelect
                  onSelect={async () => {
                    await queryClient.invalidateQueries();
                    close();
                    clearLikes();
                  }}
                />
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
