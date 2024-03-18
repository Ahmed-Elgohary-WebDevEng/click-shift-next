import { Translate } from "@/components/translate";
import React from "react";

interface FilterWrapperProps extends React.PropsWithChildren {
  title: string;
  subTitle?: string;
}

export const FilterWrapper = ({ title, subTitle, children }: FilterWrapperProps) => (
  <div className="border-b border-gray-border dark:border-gray-inputBorder  py-5  bg-white dark:bg-darkBgUi3">
    <div className="mb-4 flex flex-col">
      <strong className="text-base font-semibold">
        <Translate value={title} />
      </strong>
      <span className="text-xs text-field font-medium text-gray-field">
        <Translate value={subTitle || ""} />
      </span>
    </div>
    {children}
  </div>
);
