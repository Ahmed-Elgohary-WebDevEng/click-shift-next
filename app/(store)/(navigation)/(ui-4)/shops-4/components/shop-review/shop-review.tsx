"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import Bookmark3LineIcon from "remixicon-react/Bookmark3LineIcon";

interface ShopReviewProps {
  id?: number;
}

const ShopReviewPanel = dynamic(() => import("../shop-review-panel/shop-review-panel"));

const ShopReview = ({ id }: ShopReviewProps) => {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className="border border-white border-opacity-20 p-5 rounded-lg text-sm text-white flex flex-col items-center flex-1 justify-center h-full"
      >
        <Bookmark3LineIcon />
        {t("see.reviews")}
      </button>
      <Drawer open={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <ShopReviewPanel id={id} />
      </Drawer>
    </>
  );
};

export default ShopReview;
