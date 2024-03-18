import { BannerCardVertical } from "@/components/banner-card-vertical";
import { adsService } from "@/services/ads";
import { cookies } from "next/headers";

export const VerticalBanners = async () => {
  const lang = cookies().get("lang")?.value;
  const countryId = cookies().get("country_id")?.value;
  const cityId = cookies().get("city_id")?.value;
  const ads = await adsService.getAll(
    {
      lang,
      country_id: countryId,
      city_id: cityId,
      type: "main_left_banner",
    },
    {
      cache: "no-cache",
    }
  );
  return (
    <div className="flex flex-col gap-7 xl:col-span-1 col-span-6">
      {ads?.data?.map((banner) => (
        <BannerCardVertical
          id={banner.id}
          img={banner.galleries?.[0]?.preview || banner.galleries?.[0]?.path || ""}
          key={banner.id}
        />
      ))}
    </div>
  );
};
