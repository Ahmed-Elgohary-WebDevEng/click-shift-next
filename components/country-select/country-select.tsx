import React, { useState, useTransition } from "react";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import useAddressStore from "@/global-store/address";
import { City, Country } from "@/types/global";
import { deleteCookie, setCookie } from "cookies-next";
import { AsyncSelect } from "@/components/async-select";
import useCartStore from "@/global-store/cart";
import { useRouter } from "next/navigation";

const CountrySelect = ({ onSelect }: { onSelect: () => void }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const selectedCountry = useAddressStore((state) => state.country);
  const updateCountry = useAddressStore((state) => state.updateCountry);
  const selectedCity = useAddressStore((state) => state.city);
  const updateCity = useAddressStore((state) => state.updateCity);
  const [tempCountry, setTempCountry] = useState(selectedCountry);
  const [tempCity, setTempCity] = useState(selectedCity);
  const clearLocalCart = useCartStore((state) => state.clear);
  const [isPending, startTransition] = useTransition();

  const handleSaveAddress = () => {
    if (tempCountry) {
      updateCountry(tempCountry);
      setCookie("country_id", tempCountry.id);
      clearLocalCart();
    }
    if (tempCity) {
      updateCity(tempCity);
      setCookie("city_id", tempCity.id);
    } else {
      updateCity(null);
      deleteCookie("city_id");
    }

    startTransition(() => onSelect());
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <AsyncSelect
        label="select.country"
        onSelect={(value) => {
          setTempCountry(value);
          setTempCity(null);
        }}
        extractTitle={(option) => option?.translation?.title as string}
        extractKey={(option) => option?.id}
        queryKey="v1/rest/countries"
        queryParams={{ country_id: tempCountry?.id, has_price: true }}
        size="medium"
        value={tempCountry as Country}
      />
      {tempCountry?.cities_count !== 0 && typeof tempCountry?.cities_count !== "undefined" && (
        <AsyncSelect
          label="select.city"
          onSelect={(value) => setTempCity(value)}
          extractTitle={(option) => option?.translation?.title as string}
          extractKey={(option) => option?.id}
          queryKey="v1/rest/cities"
          size="medium"
          queryParams={{ country_id: tempCountry?.id, has_price: true }}
          value={tempCity as City}
        />
      )}
      <Button loading={isPending} onClick={handleSaveAddress} fullWidth size="small" color="black">
        {t("save.address")}
      </Button>
    </div>
  );
};

export default CountrySelect;
