"use client";

import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import { useQueryParams } from "@/hook/use-query-params";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  { name: "by.popularity", href: { column: "od_count", sort: "desc" }, current: false },
  { name: "by.date", href: { column: "id", sort: "desc" }, current: false },
];

export const Sorter = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [selectedOption, setSelectedOption] = useState(
    searchParams.has("column")
      ? sortOptions.find((option) => option.href.column === searchParams.get("column")) ||
          sortOptions[0]
      : sortOptions[0]
  );
  const { setQueryParams } = useQueryParams();
  return (
    <Listbox
      as="div"
      className="relative inline-block text-left"
      value={selectedOption}
      onChange={(value) => {
        setSelectedOption(value);
        setQueryParams(value.href, false);
      }}
    >
      <div>
        <Listbox.Button className="group inline-flex justify-center text-base font-medium items-center gap-1 outline-none   focus-visible:ring-1 ring-primary">
          {selectedOption?.name}
          <AnchorDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0" aria-hidden="true" />
        </Listbox.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Listbox.Options className="absolute md:right-0 left-0 md:left-auto z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-black shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <Listbox.Option value={option} key={option.name}>
                {({ active }) => (
                  <div
                    className={clsx(
                      option.name === selectedOption?.name
                        ? "font-medium text-gray-900 dark:text-white"
                        : "text-gray-500",
                      active ? "bg-gray-100 dark:!text-text dark:bg-dark" : "",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                  >
                    {t(option.name)}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </div>
        </Listbox.Options>
      </Transition>
    </Listbox>
  );
};
