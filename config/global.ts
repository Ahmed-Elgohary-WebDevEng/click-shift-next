export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const envLocation = process.env.NEXT_PUBLIC_DEFAULT_LOCATION?.split(",");
export const defaultLocation = envLocation
  ? { lat: Number(envLocation[0]), lng: Number(envLocation[1]) }
  : {
      lat: 41.349801,
      lng: 69.2519935,
    };

export const activeOrderStatuses = ["new", "accepted", "ready", "on_a_way"];
export const finishedOrderStatuses = ["delivered", "canceled"];

export const redirectNotificationTypesMap: Record<string, string> = {
  order: "orders",
  parcelorder: "parcels",
  blog: "news",
};

export const externalPayments = ["stripe", "razorpay", "paystack", "mollie", "moyasar"];
export const internalPayments = ["cash", "wallet"];
export const storyTiming = 10;

export const cardColors = ["#B9CCDF80", "#E3CDE180"];
