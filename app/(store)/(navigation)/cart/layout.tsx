import React from "react";
import CheckoutProvider from "./components/checkout/checkout.context";

const CartLayout = ({ children }: { children: React.ReactNode }) => (
  <CheckoutProvider>{children}</CheckoutProvider>
);

export default CartLayout;
