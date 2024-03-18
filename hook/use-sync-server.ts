import { Cart, InsertCartPayload } from "@/types/cart";
import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import useCartStore from "@/global-store/cart";
import { DefaultResponse } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { likeService } from "@/services/like";
import useLikeStore from "@/global-store/like";

export const useSyncServer = () => {
  const currency = useSettingsStore((state) => state.selectedCurrency);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const localCart = useCartStore((state) => state.list);
  const language = useSettingsStore((state) => state.selectedLanguage);
  const queryClient = useQueryClient();
  const { list, setMeny } = useLikeStore();
  const notSentList = list.filter((listItem) => !listItem.sent);
  const handleSaveMany = () => {
    likeService
      .getAll({
        type: "product",
        lang: language?.locale,
        currency_id: currency?.id,
        city_id: city?.id,
        country_id: country?.id,
      })
      .then((res) => {
        setMeny(res.data.map((product) => ({ productId: product.id, sent: true })));
      });
  };
  const { mutate: likeMany } = useMutation(
    ["likeMany"],
    () =>
      likeService.likeMany({
        types: notSentList.map((listItem) => ({
          type: "product",
          type_id: listItem.productId,
        })),
      }),
    {
      onSuccess: () => {
        handleSaveMany();
      },
    }
  );

  const { mutate: insertProductToServerCart } = useMutation({
    mutationFn: (data: InsertCartPayload) => cartService.insert(data),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: (res) => {
      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        () => res
      );
    },
  });
  const handleSync = () => {
    if (currency && country && localCart.length > 0) {
      const products = localCart.map((cartItem) => ({
        stock_id: cartItem.stockId,
        quantity: cartItem.quantity,
        images: cartItem.image ? [cartItem.image] : undefined,
      }));
      const body: InsertCartPayload = {
        currency_id: currency.id,
        rate: currency.rate,
        products,
        region_id: country?.region_id,
        country_id: country?.id,
      };
      if (city) {
        body.city_id = city.id;
      }
      insertProductToServerCart(body, {
        onSuccess: async (res) => {
          queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
            {
              queryKey: ["cart"],
              exact: false,
            },
            () => res
          );
        },
      });
    }
    if (notSentList.length > 0) {
      likeMany();
    } else {
      handleSaveMany();
    }
  };
  return { handleSync };
};
