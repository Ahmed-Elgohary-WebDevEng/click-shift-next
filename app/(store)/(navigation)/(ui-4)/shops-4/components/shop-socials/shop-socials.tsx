"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { ShopSocial } from "@/types/shop";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import QuestionAnswerLineIcon from "remixicon-react/QuestionAnswerLineIcon";

interface ShopSocialsProps {
  list?: ShopSocial[];
}

const ShopSocialsPanel = dynamic(
  () =>
    import("@/app/(store)/components/shop-socials-panel").then((component) => ({
      default: component.ShopSocialsPanel,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

export const ShopSocials = ({ list }: ShopSocialsProps) => {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsPanelOpen(true)}
        className="border border-white border-opacity-20 p-5 rounded-lg text-sm text-white flex flex-col items-center flex-1 justify-center h-full"
      >
        <QuestionAnswerLineIcon />
        {t("see.socials")}
      </button>
      <Modal isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} withCloseButton>
        <ShopSocialsPanel list={list} />
      </Modal>
    </>
  );
};
