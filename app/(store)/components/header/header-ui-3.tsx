/* eslint-disable react/no-unstable-nested-components */

"use client";

import Link from "next/link";
import { SearchField } from "@/components/search-field";
import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import MenuIcon from "@/assets/icons/menu";
import React from "react";
import { MegaMenu } from "../mega-menu";
import { AddressDropdown } from "../address-dropdown";
import { NotificationCenter } from "../notification-center";

export const HeaderUI3 = ({ settings }: { settings: Record<string, string> }) => (
  <header className="xl:px-6 py-4 px-2">
    <div className="xl:container md:px-2 xl:px-4 ">
      <div className="flex items-center justify-between gap-8 lg:px-5 px-2  bg-white dark:bg-darkBgUi3 rounded-xl py-4">
        <div className="flex items-center gap-5">
          <Link href="/" className="text-xl font-semibold">
            {settings.title}
          </Link>
          <MegaMenu
            container
            button={
              <Button leftIcon={<MenuIcon />} size="small" color="black">
                <Translate value="catalog" />
              </Button>
            }
          />
        </div>
        <div className="flex items-center justify-end md:gap-8 gap-4 flex-1">
          <SearchField visibleOnMobile={false} rounded={false} />
          <AddressDropdown rounded={false} />
          <NotificationCenter />
        </div>
      </div>
    </div>
  </header>
);
