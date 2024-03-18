import { Order, OrderCreateBody, OrderFull } from "@/types/order";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, DeliveryPoint, Paginate, ParamsType, Payment } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { ParcelPaymentBody } from "@/types/parcel";
import { WalletTopupBody } from "@/types/user";
import { Coupon } from "@/types/product";
import { getCookie } from "cookies-next";
import { BASE_URL } from "@/config/global";
import { ReviewCreateFormValues } from "@/types/review";

export const orderService = {
  create: async (data: OrderCreateBody) =>
    fetcher.post<DefaultResponse<OrderFull[]>>("v1/dashboard/user/orders", {
      body: data,
    }),
  paymentList: () => fetcher<DefaultResponse<Payment[]>>("v1/rest/payments"),
  deliveryPoints: (params: ParamsType) =>
    fetcher<Paginate<DeliveryPoint>>(buildUrlQueryParams("v1/rest/delivery-points", params)),
  createTransaction: (id: number, data: { payment_sys_id?: number }) =>
    fetcher.post(`v1/payments/order/${id}/transactions`, { body: data }),
  checkCoupon: (params?: ParamsType) =>
    fetcher.post<DefaultResponse<Coupon>>(buildUrlQueryParams("v1/rest/coupons/check", params)),
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Order>>(buildUrlQueryParams("v1/dashboard/user/orders/paginate", params)),
  get: (id?: number | null, params?: ParamsType) =>
    fetcher<DefaultResponse<OrderFull[]>>(
      buildUrlQueryParams(`v1/dashboard/user/orders/${id}/get-all`, params),
      {
        redirectOnError: true,
      }
    ),
  cancel: (id?: number) =>
    fetcher.post(`v1/dashboard/user/orders/${id}/status/change?status=canceled`),
  externalPayment: (
    type: string | undefined,
    body: OrderCreateBody | ParcelPaymentBody | WalletTopupBody
  ) =>
    fetcher.post<DefaultResponse<{ data: { url: string } }>>(
      buildUrlQueryParams(`v1/dashboard/user/${type}-process`),
      { body }
    ),
  downloadInvoice: (id?: number) =>
    fetch(`${BASE_URL}v1/dashboard/user/export/all/order/${id}/pdf`, {
      headers: {
        "Content-Type": "application/pdf",
        Authorization: getCookie("token") as string,
      },
    }),
  rateDeliveryman: (id: number, body: ReviewCreateFormValues) =>
    fetcher.post(`v1/dashboard/user/orders/deliveryman-review/${id}`, { body }),
};
