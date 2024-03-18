import React from "react";
import { ProductFull } from "@/types/product";
import dynamic from "next/dynamic";

const ReviewList = dynamic(() => import("../reviews/review-list"));

export const ProductReviews = ({ data }: { data?: ProductFull }) => (
  <div className="mt-10">
    <ReviewList type="products" id={data?.uuid} />
  </div>
);
