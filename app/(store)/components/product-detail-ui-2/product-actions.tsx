import { Button } from "@/components/button";
import HeartFillIcon from "@/assets/icons/heart-fill";
import HeartIcon from "@/assets/icons/heart";
import CompareIcon from "@/assets/icons/compare";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLike } from "@/hook/use-like";
import useCompareStore from "@/global-store/compare";
import { IconButton } from "@/components/icon-button";

export const ProductActions = ({ id }: { id?: number }) => {
  const { isLiked, handleLikeDisLike } = useLike(id);
  const addToOrRemoveFromCompareList = useCompareStore((state) => state.addOrRemove);
  const { t } = useTranslation();
  if (!id) {
    return null;
  }
  return (
    <div className="flex items-center justify-end gap-3 ">
      <IconButton onClick={() => handleLikeDisLike()} color="lightGray" size="medium">
        {isLiked ? <HeartFillIcon size={24} /> : <HeartIcon size={24} />}
      </IconButton>
      <Button
        size="xsmall"
        color="gray"
        leftIcon={<CompareIcon />}
        onClick={() => addToOrRemoveFromCompareList(id)}
      >
        {t("compare")}
      </Button>
    </div>
  );
};
