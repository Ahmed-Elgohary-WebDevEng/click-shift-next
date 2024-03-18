"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = <T = unknown>(option?: { scroll: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(Array.from(searchParams.entries()));

  const setQueryParams = useCallback(
    (params: Partial<T>, multiple = true) => {
      Object.entries(params).forEach(([key, value]) => {
        const prevValues = urlSearchParams.getAll(key);
        if (prevValues.includes(String(value)) && multiple) {
          urlSearchParams.delete(key);
          prevValues.forEach((prevValue) => {
            if (prevValue !== String(value)) {
              urlSearchParams.append(key, String(prevValue));
            }
          });
        } else if (!multiple) {
          urlSearchParams.set(key, String(value));
        } else {
          urlSearchParams.append(key, String(value));
        }
      });

      const search = urlSearchParams.toString();
      const query = search ? `?${search}` : "";

      router.replace(`${pathname}${query}`, {
        scroll: typeof option?.scroll !== "undefined" ? option.scroll : true,
      });
    },
    [urlSearchParams]
  );

  return { urlSearchParams, setQueryParams };
};
