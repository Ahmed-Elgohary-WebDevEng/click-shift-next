"use client";

import { Stock } from "@/types/product";
import React from "react";
import { Button } from "@/components/button";
import { useCart } from "@/hook/use-cart";
import { IconButton } from "@/components/icon-button";
import MinusIcon from "@/assets/icons/minus";
import PlusIcon from "@/assets/icons/plus";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { unitify } from "@/utils/unitify";
import { useElementPosition } from "@/hook/use-element-position";
import Link from "next/link";
import { Price } from "@/components/price";
import CartIcon from "@/assets/icons/cart";
import useUserStore from "@/global-store/user";
import useCartStore from "@/global-store/cart";

interface ProductStockProps {
  minQty?: number;
  selectedStock?: Stock;
  maxQty?: number;
  interval?: number;
  onScrolled: (value: boolean) => void;
}

const ProductStock = ({
  minQty = 1,
  selectedStock,
  maxQty,
  interval,
  onScrolled,
}: ProductStockProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const cartList = useCartStore((state) => state.list);
  const cartDetailId = cartList.find(
    (cartItem) => cartItem.stockId === selectedStock?.id
  )?.cartDetailId;
  const {
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    cartQuantity,
    isCounterLoading,
    handleBuyNow,
  } = useCart({
    stockId: selectedStock?.id,
    minQty,
    maxQty,
    productQty: selectedStock?.quantity,
    image: selectedStock?.galleries?.[0]?.path,
    cartDetailId,
  });
  const targetRef = useElementPosition((value) => onScrolled(value));
  return (
    <div ref={targetRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-2">
          <strong className="lg:text-4xl md:text-3xl text-2xl font-semibold">
            <Price number={selectedStock?.total_price} />
          </strong>
          {!!selectedStock?.discount && (
            <span className="text-base text-gray-field line-through">
              <Price number={selectedStock?.price} />
            </span>
          )}
        </div>
        {cartQuantity && cartQuantity > 0 ? (
          <div className="flex items-center gap-4">
            <Button as={Link} href="/cart" color="black">
              {t("go.to.cart")}
            </Button>
            <div className="flex items-center justify-between flex-1 border border-dark dark:border-white rounded-2xl">
              <IconButton
                disabled={user ? !cartDetailId : false}
                onClick={() => handleDecrement()}
                size="xlarge"
                color="transparentWithHover"
              >
                <MinusIcon />
              </IconButton>
              <span className="text-lg font-medium">{unitify(cartQuantity, interval)}</span>

              <IconButton
                onClick={() => handleIncrement()}
                size="xlarge"
                color="transparentWithHover"
              >
                <PlusIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <IconButton
              disabled={
                isCounterLoading ||
                (selectedStock && selectedStock.quantity < minQty) ||
                !selectedStock?.quantity
              }
              onClick={() => handleAddToCart()}
              color="black"
              size="xlarge"
            >
              <CartIcon />
            </IconButton>
            <Button
              loading={isCounterLoading}
              onClick={() => {
                handleBuyNow(() => router.push("/cart"));
              }}
              color="primary"
              disabled={
                (selectedStock && selectedStock.quantity < minQty) || !selectedStock?.quantity
              }
            >
              {t("buy.now")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductStock;
