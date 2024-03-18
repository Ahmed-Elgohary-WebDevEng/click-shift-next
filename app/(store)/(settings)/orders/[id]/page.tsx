"use client";

import { useRouter } from "next/navigation";
import OrderDetail from "@/app/(store)/components/order-detail";
import { Modal } from "@/components/modal";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal isOpen onClose={() => router.replace("/orders")}>
      <OrderDetail id={Number(params.id)} onRepeat={() => router.push("/cart")} />
    </Modal>
  );
};

export default OrderDetailsPage;
