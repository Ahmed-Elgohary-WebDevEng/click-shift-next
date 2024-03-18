import { Coordinate, Location, Translation } from "./global";

interface ShopTranslation extends Translation {
  description: string;
  address: string;
}

export interface WorkingDay {
  id: number;
  created_at: string;
  day: string;
  from: string;
  to: string;
  updated_at: string;
}

export interface ShopSocial {
  id: number;
  content: string;
  type: string;
}

export interface Shop {
  background_img: string;
  close_time: string;
  open_time: string;
  created_at: string;
  id: number;
  location: Location;
  logo_img: string;
  open: boolean;
  percentage: number;
  status: string;
  status_note: string;
  tax: number;
  translation: ShopTranslation | null;
  updated_at: string;
  user_id: number;
  uuid: string;
  visibility: boolean;
  verify: boolean;
  shop_working_days: WorkingDay[];
  r_avg?: number;
  r_count?: number;
  socials?: ShopSocial[];
  delivery_time: {
    to: string;
    from: string;
    type: string;
  };
}

export interface IDelivery {
  active: boolean;
  create_at: string;
  id: number;
  note: string;
  price: number;
  shop_id: number;
  times: string[];
  translation: Translation | null;
  type: string;
  updated_at: string;
}

export interface ShopDetail extends Shop {
  seller: {
    fistname: string;
    lastname: string;
    id: number;
    role: string;
  };
  rating_avg: string;
  subscription: {
    id: number;
    shop_id: number;
    subscription_id: number;
    expired_at: string;
    price: number;
    type: string;
    active: number;
    created_at: string;
    updated_at: string;
  };
}

export interface StoreWithDelivery extends Shop {
  deliveries: IDelivery[];
}

export interface CreateShopCredentials {
  tax: number;
  lat_long: number[];
  phone: string;
  delivery_time_from: string;
  delivery_time_to: string;
  delivery_time_type: string;
  title: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  min_price: number;
  address: {
    [key: string]: string;
  };
  images: string[];
  delivery_type: string;
}

export interface CreateShopBody
  extends Omit<
    CreateShopCredentials,
    "images" | "location" | "open_time" | "close_time" | "delivery_time_type" | "delivery_type"
  > {
  location: Coordinate;
  logo_image: string;
  bg_image: string;
  open_time: string;
  close_time: string;
  delivery_time_type: { id: string; label: string };
  delivery_type: { id: string; label: string };
}
