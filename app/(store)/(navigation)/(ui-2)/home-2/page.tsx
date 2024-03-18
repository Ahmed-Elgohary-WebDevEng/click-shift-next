import fetcher from "@/lib/fetcher";
import { Paginate } from "@/types/global";
import { Banner } from "@/types/banner";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { cookies } from "next/headers";
import { SlidableProductList } from "@/app/(store)/components/slidable-product-list";
import { Translate } from "@/components/translate";
import { blogService } from "@/services/blog";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Banners } from "./components/banners";
import { Categories } from "./components/categories";
import { Looks } from "./components/looks";
import { ProductList } from "./components/products-list-with-ads";
import { Banners2 } from "./components/banners-2";

const Blogs = dynamic(() => import("./components/blogs"));

const HomeUi2 = async () => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const countryId = cookies().get("country_id")?.value;
  const cityId = cookies().get("city_id")?.value;
  const banners = await fetcher<Paginate<Banner>>(
    buildUrlQueryParams("v1/rest/banners/paginate", { lang }),
    {
      cache: "no-cache",
    }
  );

  const blogs = await blogService.getAll(
    {
      lang,
      perPage: 3,
      type: "blog",
      country_id: countryId,
      city_id: cityId,
    },
    {
      cache: "no-cache",
    }
  );
  const firstPartBanners = banners.data.slice(0, 3);
  const secondPartBanners = banners.data.slice(3);

  return (
    <section className="xl:container px-2 md:px-4">
      <div
        className={clsx(
          "grid  gap-6 mb-7",
          secondPartBanners && secondPartBanners.length > 0 ? "md:grid-cols-3" : "md:grid-cols-2"
        )}
      >
        <Banners banners={firstPartBanners} />
        <Banners2 banners={secondPartBanners} />
      </div>
      <Categories />
      <SlidableProductList
        title="sale"
        extra={
          <div className="rounded-full bg-primary py-1 px-2 flex items-center">
            <span className="text-xs text-white">
              <Translate value="%sale" />
            </span>
          </div>
        }
        link="/products"
        visibleListCount={6}
        roundedColors
        params={{
          column: "od_count",
          sort: "desc",
          lang,
          currency_id: currencyId,
          country_id: countryId,
          city_id: cityId,
          has_discount: 1,
        }}
      />
      <Looks />
      <Blogs blogs={blogs} />
      <ProductList />
    </section>
  );
};

export default HomeUi2;
