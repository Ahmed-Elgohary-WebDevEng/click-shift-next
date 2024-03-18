import { UserDetail } from "@/types/user";
import { ProductGallery } from "./product";

export interface ReviewRating {
  avg: number | null;
  count: number | null;
  group: Record<number, number>;
}

export interface ReviewCreateFormValues {
  comment: string;
  rating: number;
  images?: string[];
}

export interface ReviewCreateBody extends ReviewCreateFormValues {
  type: string;
}

export interface ReviewPermission {
  added_review: boolean;
  ordered: boolean;
}

export interface Review {
  id: number;
  user: UserDetail;
  rating: number;
  comment: string;
  img: string | null;
  created_at: string;
  updated_at: string;
  galleries?: ProductGallery[];
}
