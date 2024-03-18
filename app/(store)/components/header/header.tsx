import React from "react";
import { Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import { HeaderUI1 } from "./header-ui-1";
import { HeaderUI2 } from "./header-ui-2";
import { HeaderUI3 } from "./header-ui-3";
import { HeaderUI4 } from "./header-ui-4";

interface HeaderProps {
  settings: Setting[];
}

const headers = {
  "1": HeaderUI1,
  "2": HeaderUI2,
  "3": HeaderUI3,
  "4": HeaderUI4,
};

export const Header = ({ settings }: HeaderProps) => {
  const parsedSettings = parseSettings(settings);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  const HeaderUI = headers[parsedSettings?.ui_type as keyof typeof headers] || HeaderUI1;

  return <HeaderUI settings={parsedSettings} />;
};
