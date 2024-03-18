"use client";

/* eslint-disable camelcase */
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete, MarkerF } from "@react-google-maps/api";
import { getCookie } from "cookies-next";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Pin from "@/assets/img/pin.png";
import { CreateShopBody, CreateShopCredentials } from "@/types/shop";
import { ImageTypes } from "@/types/global";
import { ImageUpload } from "@/components/image-upload";
import LoadingIcon from "@/assets/icons/loading-icon";
import { IconButton } from "@/components/icon-button";
import { shopService } from "@/services/shop";
import { useSearchAddress } from "@/hook/use-search-address";
import { TextArea } from "@/components/text-area";
import UploadLineIcon from "remixicon-react/UploadLineIcon";
import TrashIcon from "@/assets/icons/trash";
import { defaultLocation } from "@/config/global";
import { Select } from "@/app/(store)/components/select";
import { PhoneInput } from "@/components/phone-input";
import useAddressStore from "@/global-store/address";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import dynamic from "next/dynamic";

const lang = (getCookie("locale") as string) || "en";

const Map = dynamic(() =>
  import("@/components/map").then((component) => ({ default: component.Map }))
);

const shopSchema = yup.object({
  logo_image: yup.string().required("Logo image is required"),
  bg_image: yup.string().required("Background image is required"),
  min_price: yup.number().typeError("Min amount is required").required("Min amount is required"),
  tax: yup.number().typeError("Tax should be in type number").required("Shop tax is required"),
  phone: yup.string().required("Phone number is required"),
  title: yup.object({
    [lang]: yup.string().required("Shop title is required").max(255),
  }),
  description: yup.object({
    [lang]: yup.string().required("Please write comment for your shop").max(86565),
  }),
  address: yup.object({
    [lang]: yup.string().required("Shop address is required").max(255),
  }),
  delivery_time_from: yup.string().required("Open time is required").typeError("Please enter time"),
  delivery_time_to: yup.string().required("Close time is required").typeError("Please enter time"),
  delivery_time_type: yup.object().required(),
  delivery_type: yup.object().required(),
});

const BecomeSellerForm = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const country = useAddressStore((state) => state.country);
  const autoComplete = useRef<google.maps.places.Autocomplete>(null);
  const { mutate: search } = useSearchAddress();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { mutate: createStore, isLoading: createStoreLoading } = useMutation({
    mutationFn: (body: CreateShopCredentials) => shopService.create(body),
    onError: (err: NetworkError) => error(err.message),
  });
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateShopBody>({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    resolver: yupResolver(shopSchema),
    mode: "onSubmit",
    defaultValues: {
      location: {
        lat: defaultLocation.lat,
        lng: defaultLocation.lng,
      },
      delivery_type: {
        id: "2",
        label: t("self"),
      },
    },
  });

  const handleCreateStore = (data: CreateShopBody) => {
    const { logo_image, bg_image, delivery_time_type, location, delivery_type, ...dataForServer } =
      data;
    createStore(
      {
        ...dataForServer,
        images: [logo_image, bg_image],
        delivery_time_type: delivery_time_type.id,
        lat_long: [location?.lat, location?.lng],
        delivery_type: delivery_type.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["profile"]);
          success(t("successfully.created"));
        },
      }
    );
  };

  const onPlaceChanged = () => {
    if (autoComplete.current !== null) {
      const position = autoComplete.current.getPlace();
      setValue("location", {
        lat: position?.geometry?.location?.lat() || 0,
        lng: position?.geometry?.location?.lng() || 0,
      });
      setValue("address", { [lang]: position?.formatted_address || "" });
    }
  };

  return (
    <section className="flex-1">
      <form onSubmit={handleSubmit(handleCreateStore)}>
        <h2 className="text-[22px] font-medium  mb-7">{t("become.seller")}</h2>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-12 md:gap-8 gap-4">
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-5">
              <h5 className="text-lg font-medium">{t("upload.images")}</h5>
              <div className="flex items-center gap-4">
                <ImageUpload
                  onChange={(value) => setValue("logo_image", value)}
                  type={ImageTypes.SHOP_LOGO}
                >
                  {({ handleClick, preview, isLoading, handleDelete }) => (
                    <div className="relative group flex-1 w-full h-full flex flex-col">
                      {preview ? (
                        <div className="relative aspect-square rounded-2xl overflow-hidden">
                          <Image
                            src={preview}
                            alt="logo_img"
                            fill
                            className=" object-cover block"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleClick}
                          className="border-dashed border rounded-2xl w-full h-full aspect-square border-borderColor inline-flex items-center justify-center flex-col hover:bg-search"
                        >
                          <UploadLineIcon />
                          <span className="text-sm underline">{t("logo.image")}</span>
                        </button>
                      )}
                      {isLoading && (
                        <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center text-lg bg-search bg-opacity-50">
                          <LoadingIcon />{" "}
                        </div>
                      )}
                      {!!preview && (
                        <div className="absolute transition-all group-hover:opacity-100 opacity-0 w-full h-full top-0 left-0 flex items-center justify-center text-lg bg-search bg-opacity-40">
                          <IconButton color="white" size="medium" onClick={handleDelete}>
                            <TrashIcon />
                          </IconButton>
                        </div>
                      )}
                      {!!errors?.logo_image && (
                        <p role="alert" className="text-sm text-red mt-1">
                          {t(errors.logo_image.message || "")}
                        </p>
                      )}
                    </div>
                  )}
                </ImageUpload>
                <ImageUpload
                  onChange={(value) => setValue("bg_image", value)}
                  type={ImageTypes.SHOP_BG}
                >
                  {({ handleClick, preview, isLoading, handleDelete }) => (
                    <div className="relative group flex-1 w-full h-full flex flex-col">
                      {preview ? (
                        <div className="relative aspect-square rounded-2xl overflow-hidden">
                          <Image src={preview} alt="bg_img" fill className="object-cover" />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleClick}
                          className="border-dashed border w-full rounded-2xl h-full aspect-square border-borderColor inline-flex items-center justify-center flex-col hover:bg-search"
                        >
                          <UploadLineIcon />
                          <span className="text-sm underline">{t("background.image")}</span>
                        </button>
                      )}
                      {isLoading && (
                        <div className="absolute w-full h-full top-0 left-0 flex items-center justify-center text-lg bg-search">
                          <LoadingIcon />
                        </div>
                      )}
                      {!!preview && (
                        <div className="absolute transition-all group-hover:opacity-100 opacity-0 w-full h-full top-0 left-0 flex items-center justify-center text-lg bg-search bg-opacity-40">
                          <IconButton color="white" size="medium" onClick={handleDelete}>
                            <TrashIcon />
                          </IconButton>
                        </div>
                      )}
                      {!!errors?.logo_image && (
                        <p role="alert" className="text-sm text-red mt-1">
                          {t(errors.logo_image.message || "")}
                        </p>
                      )}
                    </div>
                  )}
                </ImageUpload>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <h5 className="text-lg font-medium">{t("general")}</h5>
              <Input
                fullWidth
                error={errors.title && errors.title[lang]?.message}
                {...register(`title.${lang}`)}
                label={t("name").toString()}
                required
              />
              <Controller
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    error={errors.phone?.message}
                    country={country?.code}
                    value={value}
                    onChange={onChange}
                  />
                )}
                control={control}
                name="phone"
              />
              <TextArea
                placeholder={t("description").toString()}
                rows={3}
                {...register(`description.${lang}`)}
                error={errors.description && errors.description[lang]?.message}
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-5">
              <h5 className="text-lg font-medium">{t("delivery")}</h5>
              <Select
                value={watch("delivery_time_type")}
                options={[
                  { id: "minute", label: t("minute") },
                  { id: "hour", label: t("hour") },
                ]}
                onSelect={(value) =>
                  setValue("delivery_time_type", value, { shouldValidate: true })
                }
                extractKey={(value) => value.id}
                error={errors.delivery_time_type?.message}
                extractTitle={(value) => value?.label}
                label={t("delivery.time.type")}
                required
              />
              <Select
                value={watch("delivery_type")}
                options={[
                  { id: "1", label: t("warehouse") },
                  { id: "2", label: t("self") },
                ]}
                onSelect={(value) => setValue("delivery_type", value, { shouldValidate: true })}
                extractKey={(value) => value.id}
                error={errors.delivery_type?.message}
                extractTitle={(value) => value?.label}
                label={t("delivery.type")}
                required
              />
              <Input
                fullWidth
                {...register("delivery_time_from")}
                type="number"
                error={errors.delivery_time_from?.message}
                label={t("delivery.time.from").toString()}
                required
                min={0}
              />
              <Input
                fullWidth
                {...register("delivery_time_to")}
                type="number"
                error={errors.delivery_time_to?.message}
                label={t("delivery.time.to").toString()}
                required
                min={0}
              />
            </div>
            <div className="flex flex-col gap-5">
              <h5 className="text-xl font-medium mb-2">{t("order")}</h5>
              <Input
                fullWidth
                {...register("min_price")}
                error={errors.min_price?.message}
                label={t("min.amount").toString()}
                type="number"
                required
                min={0}
              />
              <Input
                fullWidth
                {...register("tax")}
                error={errors.tax?.message}
                label={t("tax").toString()}
                type="number"
                required
                min={0}
              />
            </div>
          </div>
          <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-5">
              <h5 className="text-lg font-medium">{t("address")}</h5>

              {map && (
                <Autocomplete
                  onLoad={(autocomplete) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    autoComplete.current = autocomplete;
                  }}
                  onPlaceChanged={onPlaceChanged}
                >
                  <Input
                    label={t("address").toString()}
                    value={watch("address") ? watch("address")[lang] : ""}
                    onChange={(e) => setValue("address", { [lang]: e.target.value })}
                    error={errors?.address && errors?.address[lang]?.message}
                    fullWidth
                    required
                  />
                </Autocomplete>
              )}
              <Map
                onLoad={(loadedMap) => {
                  setMap(loadedMap);
                }}
                onClick={(e) => {
                  setValue("location", { lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
                  search(
                    { lat: e.latLng?.lat(), lng: e.latLng?.lng() },
                    {
                      onSuccess: (res) => {
                        setValue("address", { [lang]: res?.results[0]?.formatted_address });
                      },
                    }
                  );
                }}
                containerStyles={{ height: "400px", borderRadius: "15px" }}
                options={{
                  zoomControl: false,
                  mapTypeControl: false,
                  streetViewControl: false,
                  minZoom: 3,
                  center: watch("location")
                    ? { lat: watch("location")?.lat || 0, lng: watch("location")?.lng || 0 }
                    : undefined,
                }}
              >
                {watch("location") && (
                  <MarkerF
                    icon={Pin.src}
                    position={{ lat: watch("location").lat || 0, lng: watch("location").lng || 0 }}
                  />
                )}
              </Map>
            </div>
          </div>
        </div>
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-12 my-4">
          <Button type="submit" fullWidth loading={createStoreLoading}>
            {t("save")}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default BecomeSellerForm;
