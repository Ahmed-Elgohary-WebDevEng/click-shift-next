import HeartIcon from "@/assets/icons/heart";
import InfoIcon from "@/assets/icons/info";
import ListIcon from "@/assets/icons/list";
import MessageIcon from "@/assets/icons/message";
import OperatorIcon from "@/assets/icons/operator";
import ProfileIcon from "@/assets/icons/profile";
import SettingIcon from "@/assets/icons/setting";
import ShopIcon from "@/assets/icons/shop";
import CompareIcon from "@/assets/icons/compare";
import Store3LineIcon from "remixicon-react/Store3LineIcon";
import ListUnorderedIcon from "remixicon-react/ListUnorderedIcon";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
import DigitalProductIcon from "remixicon-react/File3LineIcon";
import TeamLineIcon from "remixicon-react/TeamLineIcon";
import FilePaperLineIcon from "remixicon-react/FilePaperLineIcon";
import FileUserLineIcon from "remixicon-react/FileUserLineIcon";
import UserReceivedLineIcon from "remixicon-react/UserReceivedLineIcon";

const links = [
  {
    title: "information",
    children: [
      {
        title: "my.account",
        path: "/profile",
        icon: <ProfileIcon />,
        requireAuth: true,
      },
      {
        title: "be.seller",
        path: "/be-seller",
        icon: <ShopIcon />,
        requireAuth: true,
      },
      {
        title: "order.history",
        path: "/orders",
        icon: <ListIcon />,
        requireAuth: true,
      },
      {
        title: "order.refunds",
        path: "/order-refunds",
        icon: <Refund2LineIcon />,
        requireAuth: true,
      },
      {
        title: "parcel.checkout",
        path: "/parcel-checkout",
        icon: <Store3LineIcon size={20} />,
        requireAuth: true,
      },
      {
        title: "parcels",
        path: "/parcels",
        icon: <ListUnorderedIcon size={20} />,
        requireAuth: true,
      },
      {
        title: "digital.products",
        path: "/digital",
        icon: <DigitalProductIcon size={20} />,
        requireAuth: true,
      },
      {
        title: "my.wishlist",
        path: "/liked",
        icon: <HeartIcon size={20} />,
        requireAuth: false,
      },
      {
        title: "compare",
        path: "/compare",
        icon: <CompareIcon />,
        requireAuth: false,
      },
      {
        title: "blog",
        path: "/blogs",
        icon: <MessageIcon />,
        requireAuth: false,
      },
      {
        title: "group.order",
        path: "/group",
        scroll: false,
        icon: <TeamLineIcon />,
        requireAuth: true,
      },
      {
        title: "referrals",
        path: "/referrals",
        scroll: true,
        icon: <UserReceivedLineIcon />,
        requireAuth: true,
        settingsKey: "referral_active",
        checkForSetting: true,
      },
    ],
  },
  {
    title: "setting",
    children: [
      {
        title: "app.setting",
        path: "/settings",
        icon: <SettingIcon />,
        requireAuth: false,
      },
      {
        title: "hotline",
        path: "/hotline",
        icon: <OperatorIcon />,
        requireAuth: false,
      },
      {
        title: "terms.and.conditions",
        path: "/terms",
        icon: <FilePaperLineIcon />,
        requireAuth: false,
      },
      {
        title: "privacy.policy",
        path: "/privacy",
        icon: <FileUserLineIcon />,
        requireAuth: false,
      },
      {
        title: "help",
        path: "/help",
        requireAuth: false,
        icon: <InfoIcon />,
      },
    ],
  },
];

export default links;
