"use client";

import ChevronRightIcon from "@/assets/icons/chevron-right";
import { IconButton } from "@/components/icon-button";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const links = [
  {
    title: "liked.products",
    path: "/liked",
  },
  {
    title: "discount",
    path: "/discount",
  },
];

const SpecialPagesHeader = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex items-center xl:container px-2 md:px-4 mb-4 rtl:flex-row-reverse">
      <IconButton onClick={() => router.back()} size="withoutPadding" className="rotate-180">
        <ChevronRightIcon size={30} />
      </IconButton>
      <div className="flex items-center gap-10">
        {links.map((link) => (
          <Link
            href={link.path}
            replace
            className={clsx(
              !pathname.includes(link.path) && "text-gray-field",
              "md:text-2xl sm:text-xl text-lg font-semibold"
            )}
          >
            {t(link.title)}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialPagesHeader;
