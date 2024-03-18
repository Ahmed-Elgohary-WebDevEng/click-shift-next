import fetcher from "@/lib/fetcher";
import "./globals.css";
import "swiper/css";
import "remixicon/fonts/remixicon.css";
import { Inter } from "next/font/google";
import { Country, Currency, DefaultResponse, Language, Paginate, Setting } from "@/types/global";
import { Metadata } from "next";
import { parseSettings } from "@/utils/parse-settings";
import { cookies } from "next/headers";
import React from "react";
import clsx from "clsx";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import ThemeProvider from "./theme-provider";
import GlobalProvider from "./global-provider";
import QueryClientProvider from "./query-provider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL),
    title: {
      template: `%s | ${parsedSettings.title}`,
      default: parsedSettings.title,
    },
    icons: parsedSettings.favicon,
    description: "E-commerce marketplace",
    openGraph: {
      images: [
        {
          url: parsedSettings.logo,
          width: 200,
          height: 200,
        },
      ],
      title: parsedSettings.title,
      description: "E-commerce marketplace",
      siteName: parsedSettings.title,
    },
  };
};

export default async ({ children }: { children: React.ReactNode }) => {
  const languages = await fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", {
    cache: "no-cache",
  });
  const currencies = await fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active");
  const selectedLocale = cookies().get("lang")?.value;
  const selectedDirection = cookies().get("dir")?.value;

  const defaultLanguage = languages?.data?.find((lang) => Boolean(lang.default));
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  }).then((res) => res.data);
  const parsedSettings = parseSettings(settings);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  const cookieCountryId = cookies().get("country_id")?.value;
  const countries = await fetcher<Paginate<Country>>(
    buildUrlQueryParams("v1/rest/countries", { has_price: true, country_id: cookieCountryId })
  );

  const ipInfo = await fetch("https://ipapi.co/json/").then((ip) => ip.json());
  const defaultCountry =
    countries?.data.find((country) => country.code === ipInfo?.country_code?.toLowerCase()) ||
    countries?.data?.[0];

  const css = `
    :root {
       --primary: ${parsedSettings?.ui_type === "4" ? "#FE7200" : "#E34F26"} 
    }
`;

  return (
    <html
      lang={selectedLocale || defaultLanguage?.locale || "en"}
      dir={selectedDirection || (defaultLanguage?.backward ? "rtl" : "ltr")}
    >
      <head>
        <style>{css}</style>
      </head>
      <body
        className={clsx(
          inter.className,
          "dark:bg-darkBg",
          parsedSettings?.ui_type === "3" && "bg-gray-segment",
          parsedSettings?.ui_type === "4" && "bg-gray-float"
        )}
      >
        <GlobalProvider
          languages={languages?.data}
          currencies={currencies?.data}
          settings={parsedSettings}
          defaultCountry={defaultCountry}
        >
          <ThemeProvider attribute="class" defaultTheme="light">
            <QueryClientProvider>{children}</QueryClientProvider>
          </ThemeProvider>
        </GlobalProvider>
        <div id="portal" />
      </body>
    </html>
  );
};
