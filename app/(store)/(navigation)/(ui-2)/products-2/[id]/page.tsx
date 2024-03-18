import { ProductDetail } from "@/app/(store)/components/product-detail-ui-2";
import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";
import { ProductFull } from "@/types/product";
import { Metadata } from "next";
import React from "react";
import { cookies } from "next/headers";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const { data } = await fetcher<DefaultResponse<ProductFull>>(
    buildUrlQueryParams(`v1/rest/products/${params.id}`, { lang, currency_id: currencyId }),
    { redirectOnError: true }
  );
  return {
    title: data.translation?.title,
    description: data.translation?.description,
    keywords: data.keywords,
    openGraph: {
      images: {
        url: data.img,
      },
      title: data.translation?.title,
      description: data.translation?.description,
    },
    appLinks: {
      ios: {
        url: `https://uzmart.vercel.app/producuts/${data.uuid}`,
        app_store_id: "com.gshop",
      },
      android: {
        package: "com.gshop",
        app_name: "com.gshop",
      },
      web: {
        url: "https://uzmart.vercel.app/main",
        should_fallback: false,
      },
    },
  };
};

const ProductDetailPage = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const data = await fetcher<DefaultResponse<ProductFull>>(
    buildUrlQueryParams(`v1/rest/products/${params.id}`, { lang, currency_id: currencyId })
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.data?.translation?.title,
    image:
      data?.data?.galleries && data.data.galleries.length > 0
        ? data?.data?.galleries.map((gallery) => gallery.preview || gallery.path)
        : data?.data?.img,
    description: data.data?.translation?.description,
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: data?.data?.r_avg || 0,
        bestRating: 5,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: data?.data?.r_avg || 0,
      reviewCount: data?.data?.r_count || 0,
    },
    offers: {
      "@type": "AggregateOffer",
      offerCount: data?.data?.stocks?.length || 0,
      lowPrice: data?.data?.min_price || 0,
      highPrice: data?.data?.max_price || 0,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail fullPage initialData={data} />
    </section>
  );
};

export default ProductDetailPage;
