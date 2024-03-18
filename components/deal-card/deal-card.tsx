"use client";

import ChevronRightIcon from "@/assets/icons/chevron-right";
import Image from "next/image";
import React, { useState } from "react";
import { Modal } from "../modal";

interface DealCardProps {
  img: string;
  title: string;
  description: string;
}

export const DealCard = ({ title, description, img }: DealCardProps) => {
  const [detailOpen, setDetailOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setDetailOpen(true)}
        className="focus-ring ouline-none rounded-3xl px-7 py-4 bg-gray-card dark:bg-gray-darkSegment flex items-center justify-between hover:brightness-95"
      >
        <div className="flex items-center gap-7">
          <Image width={75} height={78} src={img} alt={title} />
          <div className="flex flex-col gap-1 text-start">
            <strong className="font-bold lg:text-2xl text-lg">{title}</strong>
            <span className="lg:text-base text-xs">{description}</span>
          </div>
        </div>
        <ChevronRightIcon />
      </button>
      <Modal onClose={() => setDetailOpen(false)} isOpen={detailOpen} withCloseButton>
        <div className="md:px-8 py-8 px-4">
          <div className="rounded-3xl bg-white dark:bg-gray-inputBorder py-4 px-7 flex items-center gap-6 mr-10 rtl:ml-10 rtl:mr-0">
            <Image src={img} alt="banner" width={75} height={75} className="rounded-3xl" />
            <div className="flex flex-col gap-1">
              <strong className="lg:text-2xl text-lg font-bold">{title}</strong>
              <span className="lg:text-base text-xs">{description}</span>
            </div>
          </div>
          <div className="text-base mt-6">
            E-commerce (electronic commerce) is the buying and selling of goods. Thousands of pre
            screened, qualified carriers for over-the-road, cross-border loads in or out of the
            Mexico, and Canada are waiting in our platform to bid on your loads. Our data-driven
            platform gives us the ability to predict your needs and match your loads even faster.
          </div>
        </div>
      </Modal>
    </>
  );
};
