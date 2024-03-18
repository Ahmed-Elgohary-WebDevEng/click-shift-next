"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Modal } from "@/components/modal";
import { OrderDetailLoading } from "@/app/(store)/components/order-detail/order-detail-loading";
import OrderDetail from "@/app/(store)/components/order-detail";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal disableCloseOnOverlayClick withCloseButton isOpen onClose={() => router.back()}>
      <Suspense fallback={<OrderDetailLoading />}>
        <OrderDetail id={Number(params.id)} onRepeat={() => router.push("/cart")} />
      </Suspense>
    </Modal>
  );
};

export default OrderDetailsPage;
