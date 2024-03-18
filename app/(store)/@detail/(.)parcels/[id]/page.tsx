"use client";

import { useRouter } from "next/navigation";
import ParcelDetail from "@/app/(store)/components/parcel-detail";
import { OrderDetailLoading } from "@/app/(store)/components/order-detail/order-detail-loading";
import { Modal } from "@/components/modal";
import { Suspense } from "react";

const OrderDetailsModal = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal disableCloseOnOverlayClick withCloseButton isOpen onClose={() => router.back()}>
      <Suspense fallback={<OrderDetailLoading />}>
        <ParcelDetail id={Number(params.id)} />
      </Suspense>
    </Modal>
  );
};

export default OrderDetailsModal;
