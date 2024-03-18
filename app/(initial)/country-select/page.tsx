import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import { CountrySelectForm } from "./country-select-form";

const CountrySelectPage = async () => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  return <CountrySelectForm settings={parsedSettings} />;
};

export default CountrySelectPage;
