"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog";
import { NewsContent } from "@/app/(store)/@detail/(.)news/[id]/content";
import { NewsContentLoading } from "@/app/(store)/@detail/(.)news/[id]/content-loading";
import useSettingsStore from "@/global-store/settings";

const NewsDetailModal = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data, isLoading } = useQuery(["(.)news", params.id], () =>
    blogService.get(params.id, { lang: language?.locale })
  );
  return (
    <Modal withCloseButton isOpen onClose={() => router.back()}>
      {isLoading ? <NewsContentLoading /> : <NewsContent data={data?.data} />}
    </Modal>
  );
};

export default NewsDetailModal;
