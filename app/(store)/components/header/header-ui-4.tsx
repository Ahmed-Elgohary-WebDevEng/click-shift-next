/* eslint-disable react/no-unstable-nested-components */

"use client";

import Link from "next/link";
import { SearchField } from "@/components/search-field";
import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import MenuIcon from "@/assets/icons/menu";
import React from "react";
import UserLineIcon from "remixicon-react/UserLineIcon";
import HeartIcon from "@/assets/icons/heart";
import { MegaMenu } from "../mega-menu";
import { AddressDropdown } from "../address-dropdown";
import { NotificationCenter } from "../notification-center";

export const HeaderUI4 = ({ settings }: { settings: Record<string, string> }) => (
  <header className="xl:px-6 py-4 px-2">
    <div className="xl:container lg:px-3 md:px-2 px-0">
      <div className="flex items-center justify-between xl:gap-16 gap-8 lg:px-5 px-2  bg-white dark:bg-darkBgUi3 rounded-xl py-2.5">
        <Link href="/" className="text-xl font-semibold">
          {settings.title}
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <MegaMenu
            container
            button={
              <Button leftIcon={<MenuIcon />} size="small">
                <Translate value="catalog" />
              </Button>
            }
          />
          <SearchField visibleOnMobile={false} withButton rounded={false} />
        </div>
        <div className="flex items-center justify-end md:gap-8 gap-4 ">
          <Link
            href="/profile"
            className="focus-ring outline-none aspect-square p-1 bg-transparent disabled:cursor-not-allowed  rounded-full hidden md:block"
          >
            <UserLineIcon />
          </Link>
          <AddressDropdown onlyIcon rounded={false} />

          <Link
            href="/liked"
            className="focus-ring outline-none aspect-square p-1 bg-transparent disabled:cursor-not-allowed  rounded-full hidden md:block"
          >
            <HeartIcon />
          </Link>
          <NotificationCenter />
        </div>
      </div>
    </div>
  </header>
);
