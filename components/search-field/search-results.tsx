import { SearchProduct } from "@/types/product";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface SearchResultProps {
  data?: SearchProduct[];
  isLoading: boolean;
  onClose: () => void;
}

const SearchResults = ({ data, isLoading, onClose }: SearchResultProps) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="md:p-9 p-4 animate-pulse flex flex-col gap-4">
        <div className="h-4 rounded-full w-3/5 bg-gray-300" />
        <div className="h-4 rounded-full w-2/5 bg-gray-300" />
        <div className="h-4 rounded-full w-3/5 bg-gray-300" />
      </div>
    );
  }
  return (
    <div className="md:p-9 p-4">
      {data && data.length > 0 ? (
        <div className="flex flex-col">
          {data?.map((product) => (
            <Link
              className="border-b border-gray-border  py-5"
              scroll={false}
              onClick={onClose}
              href={`/products/${product.uuid}`}
            >
              {product.translation?.title}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex items-center text-base font-medium py-4 text-center">
          {t("there.is.nothing")}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
