import { blogService } from "@/services/blog";
import dayjs from "dayjs";
import Image from "next/image";
import { cookies } from "next/headers";

const NewsDetail = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const data = await blogService.get(params.id, { lang });
  const newsContent = data?.data;
  return (
    <div className="xl:container px-2 md:px-4">
      <span className="text-sm text-gray-disabledTab">
        {dayjs(newsContent?.published_at).format("DD MMM, YY HH:mm")}
      </span>
      <div className="flex flex-col gap-6 w-full">
        <div className="text-[22px] font-semibold mt-4 mb-1">{newsContent?.translation?.title}</div>
        {!!newsContent?.img && (
          <div className="relative w-full lg:aspect-[4/1] md:aspect-[3/1] aspect-square rounded-2xl overflow-hidden">
            <Image
              src={newsContent?.img}
              alt={newsContent?.translation?.title || "news"}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div
          className="text-base leading-7"
          dangerouslySetInnerHTML={{ __html: newsContent?.translation?.description || "" }}
        />
      </div>
    </div>
  );
};

export default NewsDetail;
