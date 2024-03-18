"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import animationData from "@/public/lottie/empty_review.json";
import Image from "next/image";
import dynamic from "next/dynamic";

const AnimatedContent = dynamic(() => import("../animated-content"));

interface EmptyProps {
  text?: string;
  animated?: boolean;
}

export const Empty = ({ text, animated = true }: EmptyProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center py-4">
      <div className="max-w-2xl flex flex-col items-center">
        {animated ? (
          <AnimatedContent animationData={animationData} />
        ) : (
          <Image
            src="/img/cartempty.png"
            alt="empty_cart"
            className="max-w-[400px]"
            width={300}
            height={400}
          />
        )}
        <span className="text-lg font-medium">{t(text || "there.is.no.items")}</span>
      </div>
    </div>
  );
};
