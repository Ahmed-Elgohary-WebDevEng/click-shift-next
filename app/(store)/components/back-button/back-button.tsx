"use client";

import AnchorLeft from "@/assets/icons/anchor-left";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { pageNames } from "../../page-names";

interface BackButtonProps {
  title?: string;
}

export const BackButton = ({ title = "back" }: BackButtonProps) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="md:text-[26px] text-xl font-semibold flex items-center focus-ring outline-none rtl:flex-row-reverse"
    >
      <AnchorLeft />
      {t(pageNames[pathname] || title)}
    </button>
  );
};
