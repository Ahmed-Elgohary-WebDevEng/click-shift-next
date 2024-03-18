import fetcher from "@/lib/fetcher";
import { Paginate } from "@/types/global";
import { Banner } from "@/types/banner";
import { Product } from "@/types/product";
import { DealCard } from "@/components/deal-card";
import dynamic from "next/dynamic";
import { SlidableProductList } from "@/app/(store)/components/slidable-product-list";
import { cookies } from "next/headers";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { blogService } from "@/services/blog";
import { adsService } from "@/services/ads";
import { Banners } from "../../components/banners";
import { CategoryFilter } from "../../components/category-filter";
import { Categories } from "../../components/categories";
import { SmallBanners } from "./components/small-banners";
import { VerticalBanners } from "./components/vertical-banners";

const deals = [
  {
    title: "Best Offer",
    description: "Popular and best products",
    img: "/img/gift.png",
  },
  {
    title: "Free shipping",
    description: "Free Shipping & Free Return",
    img: "/img/coin.png",
  },
];

const Greeting = dynamic(() => import("../../components/greeting"));
const DiscountedProducts = dynamic(() =>
  import("./components/discounted-products").then((component) => ({
    default: component.DiscountedProducts,
  }))
);
const Blogs = dynamic(() => import("./components/blogs"));

const Home = async () => {
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
  const discountProducts = await fetcher<Paginate<Product>>(
    buildUrlQueryParams("v1/rest/products/paginate", {
      lang,
      currency_id: currencyId,
      country_id: countryId,
      city_id: cityId,
    }),
    {
      cache: "no-store",
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
      next: { tags: ["blogs"] },
    }
  );

  const ads = await adsService.getAll(
    {
      lang,
      country_id: countryId,
      city_id: cityId,
      type: "main",
    },
    {
      cache: "no-cache",
      next: { tags: ["ads"] },
    }
  );

  return (
    <>
      <section className="xl:container px-2 md:px-4">
        <Greeting />
        <Banners banners={banners} />
      </section>
      <section>
        <CategoryFilter container />
        <Categories />
      </section>
      <section className="xl:container px-2 md:px-4">
        <SlidableProductList
          title="sale"
          link="/products"
          visibleListCount={6}
          params={{
            column: "od_count",
            sort: "desc",
            lang,
            currency_id: currencyId,
            country_id: countryId,
            city_id: cityId,
          }}
        />
      </section>
      <SmallBanners data={ads?.data} />
      <section className="xl:container px-2 md:px-4 grid grid-cols-6 gap-x-7">
        <div className="xl:col-span-5 col-span-6">
          <div className="mb-7">
            <SlidableProductList
              title="new.arrivals"
              link="/products"
              visibleListCount={5}
              params={{
                column: "created_at",
                sort: "desc",
                lang,
                currency_id: currencyId,
                country_id: countryId,
                city_id: cityId,
              }}
            />
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-7 gap-2 my-7">
            {deals.map((deal) => (
              <DealCard {...deal} key={deal.title} />
            ))}
          </div>
          <div className="my-7 min-w-0">
            <SlidableProductList
              title="vip.arrivals"
              link="/products"
              visibleListCount={5}
              params={{
                lang,
                currency_id: currencyId,
                country_id: countryId,
                city_id: cityId,
              }}
            />
          </div>
          <DiscountedProducts products={discountProducts} />
        </div>
        <VerticalBanners />
        <div />
      </section>
      <Blogs blogs={blogs} />
    </>
  );
};

export default Home;
