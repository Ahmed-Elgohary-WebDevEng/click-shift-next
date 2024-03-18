import React from "react";
import { ProductFull } from "@/types/product";
import dynamic from "next/dynamic";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { useModal } from "@/hook/use-modal";
import { Drawer } from "@/components/drawer";
import { LoadingCard } from "@/components/loading";

const ReviewList = dynamic(() => import("../reviews/review-list"));
const ProductReviewPanel = dynamic(
  () =>
    import("./product-review-panel").then((component) => ({
      default: component.ProductReviewPanel,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

export const ProductReviews = ({ data }: { data?: ProductFull }) => {
  const { t } = useTranslation();
  const [isDrawerOpen, openDrawer, closeDrawer] = useModal();
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <ListHeader marginBottom={false} title={t("reviews")} />

        <Button onClick={openDrawer} color="black" size="small">
          {t("send.review")}
        </Button>
      </div>
      <ReviewList type="products" id={data?.uuid} />
      <Drawer open={isDrawerOpen} onClose={closeDrawer} position="bottom">
        <ProductReviewPanel id={data?.id} uuid={data?.uuid} />
      </Drawer>
    </div>
  );
};
