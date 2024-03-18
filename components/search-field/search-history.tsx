"use client";

import { useTranslation } from "react-i18next";
import useSearchHistoryStore from "@/global-store/search-history";
import SearchIcon from "@/assets/icons/search";
import CrossIcon from "@/assets/icons/cross";

interface SearchHistoryProps {
  onItemClick: (query: string) => void;
}

const SearchHistory = ({ onItemClick }: SearchHistoryProps) => {
  const { t } = useTranslation();
  const history = useSearchHistoryStore((state) => state.list);
  const deleteFromHistory = useSearchHistoryStore((state) => state.deleteFromList);
  return (
    <div className="md:p-9 p-4">
      <h6 className="text-[22px] font-semibold">{t("recently")}</h6>
      <div className="overflow-y-auto h-full">
        {history.length > 0 ? (
          history.map((historyItem) => (
            <div className="flex items-center  border-b border-gray-border dark:border-gray-inputBorder">
              <button
                onClick={() => onItemClick(historyItem)}
                className="outline-none border-none py-5 inline-flex items-center gap-2 text-sm font-medium flex-1"
              >
                <SearchIcon />
                {historyItem}
              </button>
              <button
                className="outline-none focus-ring rounded-full"
                onClick={() => deleteFromHistory(historyItem)}
              >
                <CrossIcon />
              </button>
            </div>
          ))
        ) : (
          <div className="flex items-center text-base font-medium py-4 text-center">
            {t("there.is.nothing")}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
