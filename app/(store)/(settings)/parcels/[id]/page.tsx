"use client";

import { useRouter } from "next/navigation";
import ParcelDetail from "@/app/(store)/components/parcel-detail";
import { Modal } from "@/components/modal";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal withCloseButton isOpen onClose={() => router.replace("/parcels")}>
      <ParcelDetail id={Number(params.id)} />
    </Modal>
  );
};

export default OrderDetailsPage;
