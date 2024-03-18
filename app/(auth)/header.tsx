"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const AuthHeader = ({ settings }: { settings: Record<string, string> }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  return (
    <header className="sm:px-9 px-4 pt-6 pb-5 flex items-center justify-between">
      <Link className="text-xl font-semibold" href="/">
        {settings.title}
      </Link>
      <div className="items-center flex gap-8">
        <span className="text-base font-medium hidden sm:block">
          {pathname.includes("/login")
            ? t("you.dont.have.an.account")
            : t("you.already.have.an.account")}
        </span>
        <Button
          as={Link}
          href={pathname.includes("/login") ? "/sign-up" : "/login"}
          size="small"
          color="black"
        >
          {pathname.includes("/login") ? "Sign up" : "Login"}
        </Button>
      </div>
    </header>
  );
};

export default AuthHeader;
