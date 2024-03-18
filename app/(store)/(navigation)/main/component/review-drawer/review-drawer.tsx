"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";

const ShopReviewPanel = dynamic(() => import("../../../shops/components/shop-review-panel"), {
  loading: () => <LoadingCard />,
});
export const ReviewDrawer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Drawer
      open={searchParams.has("shop_id")}
      onClose={() => router.replace(pathname, { scroll: false })}
    >
      <ShopReviewPanel id={Number(searchParams.get("shop_id"))} />
    </Drawer>
  );
};
