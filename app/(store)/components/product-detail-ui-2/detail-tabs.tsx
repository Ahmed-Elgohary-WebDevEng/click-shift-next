import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { ProductFull } from "@/types/product";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review";
import { ProductProperties } from "./product-properties";

const ProductReviews = dynamic(() =>
  import("./product-reviews").then((component) => component.ProductReviews)
);

export const DetailTabs = ({ data }: { data?: ProductFull }) => {
  const { t } = useTranslation();
  const { data: reviews } = useQuery(["reviewList", data?.uuid, "products"], () =>
    reviewService.getAllReviews("products", data?.uuid, { column: "user" })
  );
  const reviewsLength = reviews?.data.length || 0;
  return (
    <Tab.Group>
      <Tab.List className="md:mt-20 mt-10 gap-7 flex items-center">
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={clsx(
                selected ? "text-dark dark:text-white" : "text-gray-field",
                "md:text-2xl text-xl font-semibold focus-ring outline-none"
              )}
            >
              {t("details")}
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            <button
              className={clsx(
                selected ? "text-dark dark:text-white" : "text-gray-field",
                "md:text-2xl text-xl font-semibold focus-ring outline-none"
              )}
            >
              {t("reviews")} {reviewsLength}
            </button>
          )}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <ProductProperties data={data} />
        </Tab.Panel>
        <Tab.Panel>
          <ProductReviews data={data} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};
