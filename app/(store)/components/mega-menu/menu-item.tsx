import { Button } from "@/components/button";
import Link from "next/link";
import React, { useState } from "react";
import { Category } from "@/types/category";
import ArrowDownLineIcon from "remixicon-react/ArrowDownLineIcon";
import { useTranslation } from "react-i18next";

export const MenuItem = ({ category }: { category?: Category }) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <h6 className="text-base font-bold">
        <Link href={`/products?categories=${category?.id}`}>{category?.translation?.title}</Link>
      </h6>
      {category?.children.slice(0, showMore ? category?.children.length : 6).map((subCategory) => (
        <Link
          key={subCategory.id}
          href={`/products?categories=${subCategory.id}`}
          className="text-base hover:text-text"
        >
          {subCategory.translation?.title}
        </Link>
      ))}
      {category?.children && category?.children?.length > 6 && (
        <Button
          onClick={() => setShowMore((oldValue) => !oldValue)}
          rightIcon={<ArrowDownLineIcon />}
          className="!text-blue-link"
        >
          {showMore ? t("see.all") : t("less")}
        </Button>
      )}
    </div>
  );
};
