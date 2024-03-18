"use client";

import { Input } from "@/components/input";
import { useTranslation } from "react-i18next";
import CouponIcon from "@/assets/icons/coupon";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hook/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import CrossIcon from "@/assets/icons/cross";
import DoubleCheck from "@/assets/icons/double-check";
import { Coupon } from "@/types/product";

interface CouponCheckProps {
  onCouponCheckSuccess: (coupon: Coupon) => void;
  onCouponCheckError: () => void;
  shopId?: number;
}

export const CouponCheck = ({
  onCouponCheckSuccess,
  onCouponCheckError,
  shopId,
}: CouponCheckProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | undefined>();
  const debouncedValue = useDebounce(value);
  const {
    mutate: check,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (body: string) => orderService.checkCoupon({ coupon: body, shop_id: shopId }),
    onSuccess: (res) => {
      onCouponCheckSuccess(res.data);
    },
    onError: () => {
      onCouponCheckError();
    },
  });
  useEffect(() => {
    if (debouncedValue && debouncedValue.length >= 0) {
      check(debouncedValue);
    }
  }, [debouncedValue]);
  let icon = null;
  if (value && value.length < 1) {
    icon = null;
  } else if (isError) {
    icon = (
      <span className="text-red">
        <CrossIcon />
      </span>
    );
  } else if (isSuccess) {
    icon = (
      <span className="text-green">
        <DoubleCheck />
      </span>
    );
  }
  return (
    <Input
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      leftIcon={<CouponIcon />}
      fullWidth
      rightIcon={icon}
      label={t("coupon")}
    />
  );
};
