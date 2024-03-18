"use client";

import useUserStore from "@/global-store/user";
import { useTranslation } from "react-i18next";

const Greeting = () => {
  const user = useUserStore((state) => state.user);
  const { t } = useTranslation();
  if (!user) return null;
  return (
    <h1 className="lg:text-[40px] text-2xl font-semibol mt-3 mb-7">
      {t("hello")} 👋 {user.firstname} {user?.lastname}
    </h1>
  );
};

export default Greeting;
