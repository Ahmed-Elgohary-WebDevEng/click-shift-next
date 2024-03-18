"use client";

import React from "react";
import HeartOutlinedIcon from "@/assets/icons/heart-outlined";
import HeartFillIcon from "@/assets/icons/heart-fill";
import { useLike } from "@/hook/use-like";
import HeartLightIcon from "@/assets/icons/heart-light";
import { IconButton } from "../icon-button";

const iconTypes = {
  plain: HeartOutlinedIcon,
  light: HeartLightIcon,
};

interface ProductLikeProps {
  productId: number;
  iconType?: keyof typeof iconTypes;
}

export const ProductLike = ({ productId, iconType = "plain" }: ProductLikeProps) => {
  const { isLiked, handleLikeDisLike } = useLike(productId);
  const HeartIcon = iconTypes[iconType];
  return (
    <IconButton aria-label="like or dislike" onClick={() => handleLikeDisLike()}>
      {isLiked ? <HeartFillIcon size={iconType === "light" ? 26 : 30} /> : <HeartIcon />}
    </IconButton>
  );
};
