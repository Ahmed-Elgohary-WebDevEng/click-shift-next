"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { ShopSocial } from "@/types/shop";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import QuestionAnswerLineIcon from "remixicon-react/QuestionAnswerLineIcon";
import { Button } from "@/components/button";

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
      <Button
        onClick={() => setIsPanelOpen(true)}
        color="white"
        size="xsmall"
        leftIcon={<QuestionAnswerLineIcon />}
        rounded
      >
        {t("see.socials")}
      </Button>
      <Modal isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} withCloseButton>
        <ShopSocialsPanel list={list} />
      </Modal>
    </>
  );
};
