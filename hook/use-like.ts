"use client";

import useLikeStore from "@/global-store/like";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { LikeOptions, Paginate } from "@/types/global";
import { likeService } from "@/services/like";
import { Product } from "@/types/product";
import useUserStore from "@/global-store/user";

export const useLike = (itemId?: number) => {
  const queryClint = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { list, likeOrDislike } = useLikeStore();
  const isLiked = list.some((product) => product.productId === itemId);
  const { mutate: likeRequest } = useMutation({
    mutationFn: (body: LikeOptions) => likeService.like(body),
  });
  const { mutate: disLikeRequest } = useMutation({
    mutationFn: (body: LikeOptions) => likeService.dislike(body),
    onMutate: async (body) => {
      await queryClint.cancelQueries(["likedProducts"], { exact: false });
      const prevLikeList = queryClint.getQueryData<InfiniteData<Paginate<Product>>>(
        ["likedProducts"],
        { exact: false }
      );
      queryClint.setQueriesData<InfiniteData<Paginate<Product>> | undefined>(
        { queryKey: ["likedProducts"], exact: false },
        (old) => {
          if (!old) return prevLikeList;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((product) => product.id !== body.type_id),
            })),
          };
        }
      );

      return { prevLikeList };
    },
    onError: (error, variables, context) => {
      queryClint.setQueryData(["likedProducts"], context?.prevLikeList);
    },
    onSettled: () => {
      queryClint.invalidateQueries(["likedProducts"], { exact: false });
    },
  });

  const handleLikeDisLike = () => {
    if (itemId) {
      if (user) {
        if (isLiked) {
          disLikeRequest({ type_id: itemId, type: "product" });
        } else {
          likeRequest({ type_id: itemId, type: "product" });
        }
      }
      likeOrDislike(itemId, !!user);
    }
  };
  return { handleLikeDisLike, isLiked };
};
