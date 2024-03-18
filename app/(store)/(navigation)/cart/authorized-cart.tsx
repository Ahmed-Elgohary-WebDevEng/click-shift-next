"use client";

import React, { useState, useTransition } from "react";
import { BackButton } from "@/app/(store)/components/back-button";
import { useServerCart } from "@/hook/use-server-cart";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { cartService } from "@/services/cart";
import useSettingsStore from "@/global-store/settings";
import { Price } from "@/components/price";
import dynamic from "next/dynamic";
import useCartStore from "@/global-store/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartCalculateBody } from "@/types/cart";
import { Modal } from "@/components/modal";
import { LoadingCard } from "@/components/loading";
import { CartTotal } from "@/components/cart-total";
import { useRouter } from "next/navigation";
import useAddressStore from "@/global-store/address";
import TrashIcon from "@/assets/icons/trash";
import { useModal } from "@/hook/use-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import NetworkError from "@/utils/network-error";
import { error, warning } from "@/components/alert";
import { UserCartItem } from "@/app/(store)/(navigation)/cart/components/user-cart-item";
import useUserStore from "@/global-store/user";
import { CartItem } from "@/app/(store)/(navigation)/cart/components/cart-item";
import { Types } from "./components/checkout/checkout.reducer";
import { useCheckout } from "./components/checkout/checkout.context";

const Checkout = dynamic(() => import("./components/checkout"), {
  ssr: false,
  loading: () => <LoadingCard />,
});
const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const AuthorizedCart = () => {
  const router = useRouter();
  const { data, error: cartError, isLoading } = useServerCart(true);
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const clearCart = useCartStore((state) => state.clear);
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderCreateSuccess, setIsOrderCreateSuccess] = useState(false);
  const [isOrderPermissionModalOpen, openPermissionModal, closePermissionModal] = useModal();
  const { dispatch, state: checkoutState } = useCheckout();
  const settings = useSettingsStore((state) => state.settings);
  const defaultCurrency = useSettingsStore((state) => state.defaultCurrency);
  const [isClearModalOpen, openClearModal, closeClearModal] = useModal();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const cartDetailsLength = data?.data.user_carts.flatMap((userCart) =>
    userCart.cartDetails.flatMap((detail) => detail.cartDetailProducts)
  ).length;
  const userCart = data?.data?.user_carts?.find(
    (userCartItem) => userCartItem.user_id === user?.id
  );

  const isEveryItemDigital = userCart?.cartDetails
    .flatMap((detail) => detail.cartDetailProducts)
    .every((product) => product.stock.product.digital);

  const {
    data: cartTotal,
    isFetching: isCalculating,
    isError,
  } = useQuery({
    queryKey: ["calculate", currency?.id, "delivery", userCart?.cartDetails, checkoutState.coupons],
    queryFn: () => {
      const body: CartCalculateBody = {
        currency_id: currency?.id,
        country_id: country?.id,
        city_id: city?.id,
      };
      if (
        Object.values(checkoutState.coupons).filter((coupon) => typeof coupon !== "undefined")
          .length !== 0
      ) {
        body.coupon = checkoutState.coupons;
      }
      return cartService.calculate(data?.data?.id, body);
    },
    enabled: !!currency && !!userCart,
    staleTime: Infinity,
    keepPreviousData: true,
    retry: false,
  });

  const { mutate: clearAll, isLoading: isClearing } = useMutation({
    mutationFn: () => cartService.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"], { exact: false });
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, () => undefined);
    },
    onSettled: () => {
      closeClearModal();
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const handleClearCart = () => {
    clearAll();
  };

  const handleOrderCreateSuccess = (orderId: number) => {
    router.push(`/orders/${orderId}`, { scroll: false });
    setIsOrderCreateSuccess(true);
    setIsCheckoutModalOpen(false);
    clearCart();
  };

  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    dispatch({ type: Types.ClearState, payload: { all: false } });
  };

  const handleGoToCheckout = () => {
    if (
      settings?.min_amount &&
      cartTotal?.data &&
      Number(settings?.min_amount) > cartTotal.data.price
    ) {
      warning(
        <span>
          {t("order.price.did.not.reach.the.min.amount.min.amount.is")}{" "}
          <Price number={Number(settings?.min_amount)} customCurrency={defaultCurrency} />
        </span>
      );
      return;
    }
    const members = data?.data.user_carts.filter((item) => item.user_id !== data?.data.owner_id);
    const isMemberActive = members?.some((item) => item.status);
    if (isMemberActive) {
      openPermissionModal();
      return;
    }
    startTransition(() => setIsCheckoutModalOpen(true));
  };

  if (isOrderCreateSuccess) {
    return (
      <section className="xl:container px-2 md:px-4">
        <BackButton title="order.detail" />
        <div className="flex items-center justify-center flex-col my-20">
          <Image src="/img/order-success.png" alt="empty_cart" width={300} height={400} />
          <strong className="text-xl font-bold">{t("congrats")}</strong>
          <span className="text-lg font-medium text-center ">{t("order.success.message")}</span>
        </div>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="xl:container px-2 md:px-4">
        <div className="grid grid-cols-7">
          <div className="flex flex-col gap-7 col-span-5">
            <div className="flex gap-7 animate-pulse">
              <div className="relative overflow-hidden lg:h-[320px] md:h-56 h-40 rounded-3xl aspect-[250/320] bg-gray-300" />
              <div className="flex-1 my-5">
                <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
                <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
                <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
              </div>
            </div>
            <div className="flex gap-7 animate-pulse">
              <div className="relative overflow-hidden lg:h-[320px] md:h-56 h-40 rounded-3xl aspect-[250/320] bg-gray-300" />
              <div className="flex-1 my-5">
                <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
                <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
                <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if ((!userCart && !cartDetailsLength) || cartError || cartDetailsLength === 0) {
    return (
      <section className="xl:container px-2 md:px-4">
        <BackButton title="order.detail" />
        <Empty animated={false} text="your.cart.is.empty" />
      </section>
    );
  }
  return (
    <section className="xl:container px-2 md:px-4 mb-4">
      <div className="flex items-center justify-between">
        <BackButton title="order.detail" />
        <button onClick={openClearModal} className="flex items-center gap-2.5 text-red-600">
          <TrashIcon />
          {t("clear.all")}
        </button>
      </div>
      <div className="grid grid-cols-7 mt-7 gap-7 relative pb-24">
        {data?.data.group ? (
          <div className="flex flex-col lg:col-span-5 col-span-7 gap-5 ">
            {data?.data.user_carts?.map((userCartItem) => (
              <UserCartItem
                ownerId={data?.data.owner_id}
                key={userCartItem.id}
                data={userCartItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col lg:col-span-5 col-span-7 gap-7 ">
            {userCart?.cartDetails.map((detail) => (
              <CartItem
                key={detail.id}
                data={detail}
                disabled={isCalculating}
                cartUuid={userCart.uuid}
                userId={data?.data.owner_id}
                showCoupon
              />
            ))}
          </div>
        )}
        <div className="lg:col-span-2 col-span-7">
          <div className="sticky top-2">
            <CartTotal totals={cartTotal?.data} />
            <Button
              loading={isPending || isCalculating}
              fullWidth
              disabled={isError}
              onClick={handleGoToCheckout}
            >
              {t("go.to.checkout")}
              {" - "}
              <Price number={cartTotal?.data?.total_price} />
            </Button>
          </div>
        </div>
      </div>
      <Modal withCloseButton onClose={handleCloseCheckoutModal} isOpen={isCheckoutModalOpen}>
        <Checkout
          everyItemDigital={isEveryItemDigital}
          onOrderCreateSuccess={handleOrderCreateSuccess}
        />
      </Modal>
      <ConfirmModal
        text="are.you.sure.want.to.clear.all.items.in.the.cart"
        onConfirm={handleClearCart}
        onCancel={closeClearModal}
        isOpen={isClearModalOpen}
        loading={isClearing}
      />
      <ConfirmModal
        text="group.order.permission"
        onConfirm={() => startTransition(() => setIsCheckoutModalOpen(true))}
        onCancel={closePermissionModal}
        isOpen={isOrderPermissionModalOpen}
      />
    </section>
  );
};

export default AuthorizedCart;
