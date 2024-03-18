import React from "react";
import dynamic from "next/dynamic";
import ReviewList from "@/app/(store)/components/reviews/review-list";

const ReviewSummary = dynamic(() => import("../reviews/review-summary"));
const CreateReview = dynamic(() => import("./product-review-create"));
export const ProductReviewPanel = ({ id, uuid }: { id?: number; uuid?: string }) => (
  <div className="grid grid-cols-7 gap-7 mb-4 mt-2">
    <div className="l:col-span-5 lg:col-span-4 col-span-7">
      <ReviewList title="reviews" type="products" id={uuid} />
    </div>
    <div className="xl:col-span-2 lg:col-span-3 col-span-7 mb-8 md:mb-0">
      <div className="sticky top-0">
        <ReviewSummary typeId={id} type="products" />
        <CreateReview id={id} uuid={uuid} />
      </div>
    </div>
  </div>
);
