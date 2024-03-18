import React from "react";
import MotionWrapper from "./motion-wrapper";

const MainPageLayout = ({ children }: { children: React.ReactNode }) => (
  <MotionWrapper>{children}</MotionWrapper>
);

export default MainPageLayout;
