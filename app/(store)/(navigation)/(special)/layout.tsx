import React from "react";
import SpecialPagesHeader from "./special-pages-header";

const SpecialPagesLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <SpecialPagesHeader />
    {children}
  </div>
);

export default SpecialPagesLayout;
