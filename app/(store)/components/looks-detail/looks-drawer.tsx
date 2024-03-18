"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { ProductCard } from "@/components/product-card";
import React from "react";

const LooksDetail = dynamic(
  () => import("./looks-detail").then((component) => ({ default: component.LooksDetail })),
  {
    loading: () => (
      <div className="xl:container px-2 md:px-4 grid lg:grid-cols-7 gap-7">
        <div className="lg:col-span-2 hidden lg:block animate-pulse">
          <div className="rounded-2xl md:aspect-[411/609] aspect-[1/1.15] bg-gray-300" />
        </div>
        <div className="lg:col-span-5">
          <div className={clsx("grid gap-7 grid-cols-1")}>
            {Array.from(Array(3).keys()).map((product) => (
              <ProductCard.Loading variant="3" key={product} />
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

const LooksDrawer = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      open={searchParams.has("looksId")}
      onClose={() => router.replace(pathname, { scroll: false })}
    >
      <LooksDetail id={Number(searchParams.get("looksId"))} />
    </Drawer>
  );
};

export default LooksDrawer;
