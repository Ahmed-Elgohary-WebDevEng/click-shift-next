import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { Metadata } from "next";
import { ReferralContent } from "./content";

export const generateMetadata = async (): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const data = await infoService.terms({ lang });
  return {
    title: data?.data.translation?.title,
  };
};

const ReferralTerms = async () => {
  const lang = cookies().get("lang")?.value;
  const data = await infoService.referrals({ lang });
  return <ReferralContent data={data} />;
};

export default ReferralTerms;
