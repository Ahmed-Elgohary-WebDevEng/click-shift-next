"use client";

import React from "react";
import { useScrollDirection } from "@/hook/use-scroll-direction";
import clsx from "clsx";
import useSettingsStore from "@/global-store/settings";

export const AppBar = ({ children }: { children: React.ReactNode }) => {
  const direction = useScrollDirection();
  const settings = useSettingsStore((state) => state.settings);
  return (
    <div
      className={clsx(
        "fixed z-[9]  left-1/2 -translate-x-1/2 w-full flex  justify-center transition-all items-center gap-2 max-w-max",
        settings?.ui_type !== "4" && direction === "down" && "-bottom-full",
        settings?.ui_type !== "4" && direction !== "down" && "bottom-8",
        settings?.ui_type === "4" && direction === "down" && "md:-bottom-full bottom-0",
        settings?.ui_type === "4" && direction !== "down" && "md:bottom-8 bottom-0"
      )}
    >
      {children}
    </div>
  );
};
