import { Product } from "@/types/product";
import { Price } from "@/components/price";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import TimerIcon from "@/assets/icons/timer";
import { useExpireDate } from "@/hook/use-expire-date";
import Link from "next/link";

interface DiscountedProductCardProps {
  data: Product;
}

export const DiscountedProductCard = ({ data }: DiscountedProductCardProps) => {
  const { t } = useTranslation();
  const [days, hours, minutes] = useExpireDate(data.stocks?.[0]?.discount_expired_at);

  return (
    <Link href={`/products/${data.uuid}`} scroll={false}>
      <div className="flex flex-col px-7 py-5 h-full">
        <span className="text-base font-medium text-center">{data.translation?.title}</span>
        <div className="flex items-center gap-3 justify-center">
          <span className="text-red text-base font-medium line-through">
            <Price number={data.stocks?.[0].price} />
          </span>
          <strong className="text-xl font-bold">
            <Price number={data.stocks?.[0].total_price} />
          </strong>
        </div>
        <div className="flex-1 relative aspect-[1.5/1] sm:aspect-[2/1] md:aspect-auto">
          <Image
            src={data.img}
            alt={data.translation?.title || "product"}
            fill
            className="object-contain"
          />
        </div>
        <div className="text-primary bg-primary-ui3OpacityBg lg:px-10 px-5 py-3 rounded-xl flex items-center justify-between mt-4 text-base font-medium">
          <TimerIcon />
          <span>{days}</span>:<span>{hours < 10 ? `0${hours}` : hours}</span>:
          <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
        </div>
        <span className="xl:text-2xl lg:text-xl text-base font-semibold text-center">
          {t("discounts.of.this.week")}
        </span>
      </div>
    </Link>
  );
};
