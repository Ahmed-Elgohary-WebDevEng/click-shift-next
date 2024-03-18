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

export const HeaderUI2 = ({ settings }: { settings: Record<string, string> }) => (
  <header className="px-4 py-6">
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-5">
        <Link href="/" className="text-xl font-semibold">
          {settings.title}
        </Link>
        <MegaMenu
          button={
            <Button leftIcon={<MenuIcon />} rounded size="small" color="black">
              <Translate value="catalog" />
            </Button>
          }
        />
      </div>
      <div className="flex items-center justify-end md:gap-8 gap-4 flex-1">
        <SearchField visibleOnMobile={false} />
        <AddressDropdown rounded />
        <NotificationCenter />
      </div>
    </div>
  </header>
);
