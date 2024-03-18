"use client";

import { useModal } from "@/hook/use-modal";
import { IconButton } from "@/components/icon-button";
import Menu3LineIcon from "remixicon-react/Menu3LineIcon";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";

const ProfileSidebar = dynamic(() => import("./sidebar"));

const MobileSidebar = () => {
  const [isDrawerOpen, openDrawer, closeDrawer] = useModal();
  return (
    <div className="lg:hidden">
      <IconButton onClick={openDrawer} size="small" rounded>
        <Menu3LineIcon />
      </IconButton>
      <Drawer position="right" open={isDrawerOpen} onClose={closeDrawer}>
        <ProfileSidebar inDrawer onClose={closeDrawer} />
      </Drawer>
    </div>
  );
};

export default MobileSidebar;
