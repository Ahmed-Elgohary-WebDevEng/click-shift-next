"use client";

import useCartStore from "@/global-store/cart";
import BagFillIcon from "@/assets/icons/bag-fill";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useServerCart } from "@/hook/use-server-cart";
import useUserStore from "@/global-store/user";
import { usePathname } from "next/navigation";
import useSettingsStore from "@/global-store/settings";

const CartIndicator = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const cartList = useCartStore((state) => state.list);
  const cartProductsQuantity = cartList?.length || 0;
  const user = useUserStore((state) => state.user);
  const settings = useSettingsStore((state) => state.settings);

  useServerCart(!!user);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (settings?.ui_type === "4") return null;
  if (pathname !== "/products") return null;

  if (cartProductsQuantity < 1) return null;
  return (
    <Link href="/cart">
      <div className="flex items-center bg-dark bg-opacity-70 rounded-full p-2 gap-2 backdrop-blur-lg">
        <div className="hidden md:block">
          <BagFillIcon />
        </div>
        <span className="text-white text-lg font-medium md:inline hidden">{t("go.to.cart")}</span>
        <div className="flex md:ml-3 items-center justify-center rounded-full md:w-14 md:h-14 h-11 w-11 bg-primary text-white text-2xl font-medium">
          {cartProductsQuantity}
        </div>
      </div>
    </Link>
  );
};

export default CartIndicator;
