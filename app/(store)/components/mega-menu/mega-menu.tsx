"use client";

import { Popover, Transition } from "@headlessui/react";
import React from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import useSettingsStore from "@/global-store/settings";

const MegaMenuPanel = dynamic(() => import("./mega-menu-panel"));

interface MegaMenuProps {
  button?: React.ReactElement;
  container?: boolean;
}

export const MegaMenu = ({ button, container }: MegaMenuProps) => {
  const settings = useSettingsStore((state) => state.settings);
  return (
    <Popover className="lg:flex hidden">
      <>
        <Popover.Button as={React.Fragment}>
          {({ open }) =>
            button || (
              <button className="relative group outline-primary outline-offset-2 flex justify-center items-center rounded-full">
                <div className="relative flex items-center justify-center transform transition-all">
                  <div className="flex flex-col justify-between w-[24px] h-[12px] transform transition-all duration-300 origin-center">
                    <div
                      className={clsx(
                        "bg-black dark:bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ",
                        open && "group-focus:rotate-[22deg]"
                      )}
                    />
                    <div
                      className={clsx(
                        "bg-black dark:bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ",
                        open && "group-focus:-rotate-[22deg]"
                      )}
                    />
                  </div>
                </div>
              </button>
            )
          }
        </Popover.Button>
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            className={clsx(
              "absolute z-20  inset-x-0 min-h-screen  bg-white dark:bg-darkBg",
              settings?.ui_type === "3" ? "mt-16" : "mt-12"
            )}
          >
            {({ close }) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                className={clsx("overflow-hidden px-2", container && "container pt-4")}
                onClick={() => close()}
              >
                <MegaMenuPanel />
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </>
    </Popover>
  );
};
