import HeartFillIcon from "@/assets/icons/heart-fill";
import HeartIcon from "@/assets/icons/heart";
import React from "react";
import { useLike } from "@/hook/use-like";
import useCompareStore from "@/global-store/compare";
import { IconButton } from "@/components/icon-button";
import ChartIcon from "@/assets/icons/chart";

export const ProductActions = ({ id }: { id?: number }) => {
  const { isLiked, handleLikeDisLike } = useLike(id);
  const addToOrRemoveFromCompareList = useCompareStore((state) => state.addOrRemove);
  const compareList = useCompareStore((state) => state.ids);
  const isInCompareList = compareList.includes(id || -1);
  if (!id) {
    return null;
  }
  return (
    <div className="flex items-center justify-end gap-3 ">
      <IconButton onClick={() => addToOrRemoveFromCompareList(id)} size="small">
        {isInCompareList ? (
          <span className="text-primary">
            <ChartIcon />
          </span>
        ) : (
          <ChartIcon />
        )}
      </IconButton>
      <IconButton onClick={() => handleLikeDisLike()} size="small">
        {isLiked ? <HeartFillIcon size={30} /> : <HeartIcon size={30} />}
      </IconButton>
    </div>
  );
};
