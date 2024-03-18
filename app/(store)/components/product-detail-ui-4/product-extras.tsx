import clsx from "clsx";
import { ExtraValueUi4 } from "@/app/(store)/components/extra-value/extra-value-ui-4";
import React, { useMemo } from "react";
import { groupExtras } from "@/utils/group-extras";
import { ExtraValue as ExtraValueType, Stock } from "@/types/product";

interface ProductExtrasProps {
  stocks?: Stock[];
  selectedStock?: Stock;
  onSelectStock: (stock: Stock) => void;
  onSelectColor: (value: ExtraValueType) => void;
}

const ProductExtras = ({
  stocks,
  selectedStock,
  onSelectStock,
  onSelectColor,
}: ProductExtrasProps) => {
  const groupedExtras = useMemo(() => groupExtras(stocks, selectedStock), [stocks, selectedStock]);
  return (
    <div className="grid md:grid-cols-2  gap-5 mt-5">
      {groupedExtras.map((groupedExtra) => (
        <div key={groupedExtra.group.id} className={clsx("bg-white dark:bg-transparent py-4")}>
          <span className="font-bold text-2xl">{groupedExtra.group.translation?.title}</span>
          <div className="flex items-center gap-2 md:mt-5 mt-4 flex-wrap">
            {groupedExtra.values.map((extraValue) => (
              <ExtraValueUi4
                onClick={() => {
                  onSelectStock(extraValue.stock);
                  if (extraValue.stock.galleries && groupedExtra.group.type === "color")
                    onSelectColor(extraValue.data);
                }}
                data={extraValue.data}
                key={extraValue.data?.id}
                group={groupedExtra.group.type}
                selected={selectedStock?.extras.some(
                  (selectedExtras) => selectedExtras.extra_value_id === extraValue.data?.id
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductExtras;
