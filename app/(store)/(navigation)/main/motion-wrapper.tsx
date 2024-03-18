"use client";

import React from "react";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./motion-features").then((res) => res.default);

const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <LazyMotion features={loadFeatures}>{children}</LazyMotion>
);

export default MotionWrapper;
