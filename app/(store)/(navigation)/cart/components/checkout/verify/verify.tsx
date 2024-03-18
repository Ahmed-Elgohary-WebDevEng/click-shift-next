import { useServerCart } from "@/hook/use-server-cart";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { cartService } from "@/services/cart";
import useSettingsStore from "@/global-store/settings";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { orderService } from "@/services/order";
import { OrderCreateBody } from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartCalculateBody } from "@/types/cart";
import { error } from "@/components/alert";
import { CartTotal } from "@/components/cart-total";
import NetworkError from "@/utils/network-error";
import { useExternalPayment } from "@/hook/use-external-payment";
import { internalPayments } from "@/config/global";
import useAddressStore from "@/global-store/address";
import { IconButton } from "@/components/icon-button";
import AnchorLeft from "@/assets/icons/anchor-left";
import { CheckoutScreenProps } from "../types";
import { Types } from "../checkout.reducer";
import { useCheckout } from "../checkout.context";
import { CheckoutProductGroup } from "../components/checkout-product-group";

const DeliveryTime = dynamic(() =>
  import("../components/delivery-time").then((component) => ({ default: component.DeliveryTime }))
);

const CheckoutVerify = ({
  onOrderCreateSuccess,
  onPrev,
  everyItemDigital,
}: CheckoutScreenProps) => {
  const { t } = useTranslation();
  const { data } = useServerCart();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);
  const { state, dispatch } = useCheckout();
  const queryClient = useQueryClient();
  const { mutate: externalPay, isLoading: isExternalPayLoading } = useExternalPayment();

  const { data: cartTotal, isLoading: isCalculating } = useQuery({
    queryKey: ["calculate", currency?.id, state.deliveryType, country?.id, city?.id],
    queryFn: () => {
      const body: CartCalculateBody = {
        currency_id: currency?.id,
        delivery_type: state.deliveryType,
        country_id: country?.id,
        city_id: city?.id,
        lang: language?.locale,
      };
      if (!everyItemDigital && state.deliveryType === "delivery") {
        body.delivery_price_id = state.deliveryPrice?.id;
      }
      if (!everyItemDigital && state.deliveryType === "point") {
        body.delivery_point_id = state.deliveryPoint?.id;
      }
      if (everyItemDigital) {
        body.delivery_type = "digital";
      }
      if (
        Object.values(state.coupons).filter((coupon) => typeof coupon !== "undefined").length !== 0
      ) {
        body.coupon = state.coupons;
      }
      return cartService.calculate(data?.data.id, body);
    },
    enabled: !!data?.data?.id,
  });

  const { mutate: createOrder, isLoading: isOrderCreateLoading } = useMutation({
    mutationFn: (body: OrderCreateBody) => orderService.create(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const handleSelectDeliveryDate = (selectedTime: Date) => {
    dispatch({ type: Types.UpdateDeliverDate, payload: { date: selectedTime } });
    setIsDeliveryTimeModalOpen(false);
  };

  const handleCreateOrder = async () => {
    const body: OrderCreateBody = {
      delivery_date: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      currency_id: currency?.id,
      rate: currency?.rate,
      cart_id: data?.data?.id,
      delivery_type: everyItemDigital ? "digital" : state.deliveryType,
      notes:
        Object.keys(state.notes).length !== 0 || Object.keys(state.shopNotes).length !== 0
          ? {
              product: Object.keys(state.notes).length !== 0 ? state.notes : undefined,
              order: Object.keys(state.shopNotes).length !== 0 ? state.shopNotes : undefined,
            }
          : undefined,
    };
    if (!everyItemDigital && state.deliveryType === "point") {
      body.delivery_point_id = state.deliveryPoint?.id;
    }
    if (!everyItemDigital && state.deliveryType === "delivery") {
      body.delivery_price_id = state.deliveryPrice?.id;
      body.address_id = state.deliveryAddress?.id;
    }

    const tempCoupons = { ...state.coupons };

    Object.entries(state.coupons).forEach(([key, coupon]) => {
      if (typeof coupon === "undefined") {
        delete tempCoupons[Number(key)];
      }
    });

    if (Object.keys(tempCoupons).length !== 0) {
      body.coupon = tempCoupons;
      body.coupon = tempCoupons;
    }

    if (internalPayments.includes(state.paymentMethod?.tag || "")) {
      body.payment_id = state.paymentMethod?.id;
    }

    if (!internalPayments.includes(state.paymentMethod?.tag || "")) {
      externalPay(
        {
          tag: state.paymentMethod?.tag,
          data: body,
        },
        {
          onSuccess: async () => {
            dispatch({ type: Types.ClearState, payload: { all: true } });
            await queryClient.invalidateQueries(["profile"], { exact: false });
            await queryClient.invalidateQueries(["cart"], { exact: false });
          },
        }
      );
      return;
    }

    createOrder(body, {
      onSuccess: async (res) => {
        dispatch({ type: Types.ClearState, payload: { all: true } });
        await queryClient.invalidateQueries(["profile"], { exact: false });
        await queryClient.invalidateQueries(["cart"], { exact: false });
        const parentOrder = res.data.find(
          (orderDetail) => typeof orderDetail.parent_id === "undefined"
        );
        if (typeof onOrderCreateSuccess !== "undefined" && parentOrder) {
          onOrderCreateSuccess(parentOrder.id);
        }
      },
    });
  };

  return (
    <div className="mt-7">
      <h6 className="text-base font-semibold">{t("your.order")}</h6>
      {data?.data?.user_carts?.map((userCart) => (
        <div key={userCart.uuid} className="my-5 flex flex-col gap-4">
          {userCart?.cartDetails.map((detail) => (
            <CheckoutProductGroup calcResult={cartTotal?.data} data={detail} key={detail.id} />
          ))}
        </div>
      ))}
      <CartTotal couponStyle={false} totals={cartTotal?.data} />
      <div className="flex items-center gap-4 mt-7">
        <IconButton onClick={onPrev} color="blackOutlined" size="xlarge">
          <AnchorLeft size={24} />
        </IconButton>
        <Button
          loading={isOrderCreateLoading || isExternalPayLoading}
          disabled={
            isCalculating || (!!cartTotal?.data?.errors && cartTotal?.data?.errors?.length !== 0)
          }
          fullWidth
          onClick={handleCreateOrder}
          color="black"
        >
          {t("confirm.and.pay")}
        </Button>
      </div>
      <Modal
        isOpen={isDeliveryTimeModalOpen}
        onClose={() => setIsDeliveryTimeModalOpen(false)}
        withCloseButton
      >
        <DeliveryTime defaultValue={state.deliveryDate} onSelect={handleSelectDeliveryDate} />
      </Modal>
    </div>
  );
};

export default CheckoutVerify;
