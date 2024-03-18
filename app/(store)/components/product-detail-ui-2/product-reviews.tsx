import React from "react";
import { ProductFull } from "@/types/product";
import dynamic from "next/dynamic";

const ReviewSummary = dynamic(() => import("../reviews/review-summary"));
const CreateReview = dynamic(() => import("./product-review-create"));
const ReviewList = dynamic(() => import("../reviews/review-list"));

export const ProductReviews = ({ data }: { data?: ProductFull }) => (
  <div className="grid grid-cols-7 gap-7 mt-10">
    <div className="xl:col-span-5 lg:col-span-4 col-span-7">
      <ReviewList type="products" id={data?.uuid} />
    </div>
    <div className="xl:col-span-2 lg:col-span-3 col-span-7">
      <ReviewSummary typeId={data?.id} type="products" />
      <CreateReview id={data?.id} uuid={data?.uuid} />
    </div>
  </div>
);
