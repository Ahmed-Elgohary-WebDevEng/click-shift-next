"use client";

import { useTranslation } from "react-i18next";
import clsx from "clsx";
import React from "react";
import { Types } from "../checkout.reducer";
import { CheckoutDeliveryForm } from "../components/delivery-form";
import { CheckoutPickupForm } from "../components/pickup-form";
import { CheckoutScreenProps } from "../types";
import { useCheckout } from "../checkout.context";

const shippingTypes = [
  {
    value: "delivery",
    label: "delivery",
    component: CheckoutDeliveryForm,
  },
  {
    value: "point",
    label: "pickup",
    component: CheckoutPickupForm,
  },
];

const CheckoutShipping = ({ onNext, isPageChanging, onPrev }: CheckoutScreenProps) => {
  const { t } = useTranslation();
  const { state, dispatch } = useCheckout();
  const ShippingUi = shippingTypes.find((type) => type.value === state.deliveryType)?.component;
  return (
    <>
      <div className="bg-gray-layout dark:bg-gray-darkSegment rounded-lg p-1 flex items-center mt-7">
        {shippingTypes.map((tab) => (
          <button
            onClick={() =>
              dispatch({ type: Types.UpdateDeliveryType, payload: { type: tab.value } })
            }
            className={clsx(
              "inline-flex text-sm relative z-[1] py-2 px-8 items-center gap-2 rounded-md capitalize flex-1 justify-center",
              tab.value === state.deliveryType
                ? "text-black bg-white dark:bg-dark dark:text-white"
                : "text-gray-field"
            )}
            key={tab.value}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>
      {ShippingUi && <ShippingUi onPrev={onPrev} onNext={onNext} isPageChanging={isPageChanging} />}
    </>
  );
};

export default CheckoutShipping;
