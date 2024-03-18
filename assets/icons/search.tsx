import { IconType } from "@/types/utils";
import React from "react";

const SearchIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "18"}
    height={size || "18"}
    viewBox="0 0 18 18"
    {...otherProps}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1.5"
      y="1.5"
      width="14.25"
      height="14.25"
      rx="7.125"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <line
      x1="13.9521"
      y1="14.25"
      x2="15.4016"
      y2="15.6996"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchIcon;
