"use client";

import { Button } from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-2xl">{t("not.found")}</h1>
              <p className="my-2 ">{t("notfound.description")}</p>
              <Button as={Link} href="/">
                {t("back.to.home")}
              </Button>
            </div>
          </div>
          <div>
            <Image
              priority
              width={500}
              height={500}
              src="https://i.ibb.co/G9DC8S0/404-2.png"
              alt="notfound"
            />
          </div>
        </div>
      </div>
      <div>
        <Image
          priority
          width={600}
          height={600}
          src="https://i.ibb.co/ck1SGFJ/Group.png"
          alt="group"
        />
      </div>
    </div>
  );
};

export default NotFound;
