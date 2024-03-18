import fetcher from "@/lib/fetcher";
import { Banner } from "@/types/banner";
import { Paginate } from "@/types/global";
import React from "react";
import dynamic from "next/dynamic";
import { Translate } from "@/components/translate";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { cookies } from "next/headers";
import { Banners } from "../../components/banners";
import { HomeList } from "../../components/home-list";
import { ReviewDrawer } from "./component/review-drawer";

const BrandList = dynamic(() => import("../../components/brand-list"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-6 justify-between">
      {Array.from(Array(6).keys()).map((item) => (
        <div key={item} className="bg-gray-300 w-28 h-24 rounded-xl" />
      ))}
    </div>
  ),
});

const Looks = dynamic(
  () => import("./component/looks").then((component) => ({ default: component.Looks })),
  {
    loading: () => (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 mt-7">
        <div className="aspect-square rounded-[25px] bg-gray-300" />
        <div className="aspect-square rounded-[25px] bg-gray-300" />
        <div className="aspect-square rounded-[25px] bg-gray-300" />
      </div>
    ),
  }
);

const Stories = dynamic(() => import("../../components/stories/stories"), { ssr: false });

export const metadata = {
  title: "Main",
};

const Home = async () => {
  const lang = cookies().get("lang")?.value;
  const banners = await fetcher<Paginate<Banner>>(
    buildUrlQueryParams("v1/rest/banners/paginate", { lang }),
    {
      cache: "no-cache",
    }
  );
  return (
    <>
      <section className="xl:container px-2 md:px-4">
        <Banners banners={banners} />
      </section>
      <Stories />
      <HomeList />
      <section className="xl:container px-2 md:px-4 mb-10">
        <span className="md:text-[26px] text-xl font-semibold mb-6">
          <Translate value="popular.brands" />
        </span>
        <BrandList />
        <Looks />
      </section>
      <ReviewDrawer />
    </>
  );
};

export default Home;
