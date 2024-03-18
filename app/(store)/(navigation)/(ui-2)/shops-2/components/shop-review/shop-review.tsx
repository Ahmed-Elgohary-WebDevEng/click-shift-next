"use client";

import React, { useState } from "react";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";

interface ShopReviewProps {
  id?: number;
}

const ShopReviewPanel = dynamic(() => import("../shop-review-panel/shop-review-panel"));

const ShopReview = ({ id }: ShopReviewProps) => {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setIsPanelOpen(true)} size="xsmall" rounded>
        {t("see.reviews")}
      </Button>
      <Drawer open={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <ShopReviewPanel id={id} />
      </Drawer>
    </>
  );
};

export default ShopReview;
