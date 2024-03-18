import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { CreateShopCredentials, Shop } from "@/types/shop";

export const shopService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Shop>>(buildUrlQueryParams("v1/rest/shops/paginate", params)),
  create: (data: CreateShopCredentials) => fetcher.post("v1/dashboard/user/shops", { body: data }),
};
