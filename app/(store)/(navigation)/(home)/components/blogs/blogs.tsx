"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService } from "@/services/blog";
import useSettingsStore from "@/global-store/settings";
import useAddressStore from "@/global-store/address";
import { ListHeader } from "@/components/list-header/list-header";
import { BlogCard } from "@/components/blog-card";
import { Blog, BlogShortTranslation } from "@/types/blog";
import { Paginate } from "@/types/global";
import { useTranslation } from "react-i18next";

const Blogs = ({ blogs }: { blogs?: Paginate<Blog<BlogShortTranslation>> }) => {
  const { t } = useTranslation();
  const language = useSettingsStore((state) => state.selectedLanguage);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const params = {
    lang: language?.locale,
    perPage: 3,
    type: "blog",
    country_id: country?.id,
    city_id: city?.id,
  };
  const { data: actualBlogs } = useQuery(["blogs", params], () => blogService.getAll(params), {
    initialData: blogs,
  });

  return (
    <section className="xl:container px-2 md:px-4  my-7">
      <ListHeader title={t("latest.blogs")} link="/blogs" />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
        {actualBlogs?.data?.map((blog) => (
          <BlogCard data={blog} key={blog.id} />
        ))}
      </div>
    </section>
  );
};

export default Blogs;
