import { DefaultResponse, Paginate, ParamsType, Referral, Term } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Faq } from "@/types/info";

export const infoService = {
  terms: (params?: ParamsType) =>
    fetcher<DefaultResponse<Term>>(buildUrlQueryParams("v1/rest/term", params), {
      redirectOnError: true,
      cache: "no-cache",
    }),

  privacy: (params?: ParamsType) =>
    fetcher<DefaultResponse<Term>>(buildUrlQueryParams("v1/rest/policy", params), {
      redirectOnError: true,
    }),
  faq: (params: ParamsType) =>
    fetcher<Paginate<Faq>>(buildUrlQueryParams("v1/rest/faqs/paginate", params), {
      cache: "no-cache",
    }),
  referrals: (params?: ParamsType) =>
    fetcher<DefaultResponse<Referral>>(buildUrlQueryParams("v1/rest/referral", params), {
      cache: "no-cache",
    }),
};
