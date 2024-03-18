"use client";

import { DefaultResponse, Term } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { infoService } from "@/services/info";

interface TermsContentProps {
  data?: DefaultResponse<Term>;
}

export const TermsContent = ({ data }: TermsContentProps) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data: terms } = useQuery(
    ["terms", language?.locale],
    () => infoService.terms({ lang: language?.locale }),
    {
      initialData: data,
    }
  );

  return (
    <div className="xl:container px-2 md:px-4">
      <h1 className="md:text-[26px] text-xl font-semibold">{terms?.data?.translation?.title}</h1>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: terms?.data?.translation?.description || "" }}
      />
    </div>
  );
};
