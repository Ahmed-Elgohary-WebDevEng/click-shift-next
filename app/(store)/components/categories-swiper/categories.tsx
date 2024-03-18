import { categoryService } from "@/services/category";
import { cookies } from "next/headers";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import { CategoriesSwiper } from "./categories-swiper";

export const Categories = async () => {
  const lang = cookies().get("lang")?.value;
  const categories = await categoryService.getAll({ lang, type: "main" });
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  }).then((res) => res.data);
  const parsedSettings = parseSettings(settings);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  if (parsedSettings?.ui_type === "4") {
    return <CategoriesSwiper categories={categories} />;
  }

  return null;
};
