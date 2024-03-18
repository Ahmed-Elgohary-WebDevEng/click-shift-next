"use client";

import { DefaultResponse, Referral } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import useSettingsStore from "@/global-store/settings";
import { infoService } from "@/services/info";
import { Translate } from "@/components/translate";

interface ReferralContentProps {
  data?: DefaultResponse<Referral>;
}

export const ReferralContent = ({ data }: ReferralContentProps) => {
  const language = useSettingsStore((state) => state.selectedLanguage);
  const { data: referrals } = useQuery(
    ["referral-terms", language?.locale],
    () => infoService.referrals({ lang: language?.locale }),
    {
      initialData: data,
    }
  );

  return (
    <div className="xl:container px-2 md:px-4">
      <h1 className="md:text-head text-xl font-semibold">
        <Translate value="referral.terms" />
      </h1>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: referrals?.data?.translation?.faq || "" }}
      />
    </div>
  );
};
