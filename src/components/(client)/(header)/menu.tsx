import { FaList, FaCreditCard, FaNewspaper } from "react-icons/fa";
import {FaPeopleRoof} from "react-icons/fa6";
// import { MdOutlineContactPhone } from "react-icons/md";

type BaseMenuItem = {
  label: string;
};

type WithPath = BaseMenuItem & {
  path: string;
  items?: never;
  icon: React.ReactNode;
};

type WithChildren = BaseMenuItem & {
  items?: IMenuItem[];
  path?: never;
  icon?: React.ReactNode;
};

export type IMenuItem = WithPath | WithChildren;

export const menu: IMenuItem[] = [
  {
    label: "Danh mục",
    path: "/danh-muc",
    icon: <FaList className={`h6 w-6`} />,
  },
  {
    label: "Nạp thẻ",
    path: "/nap-the",
    icon: <FaCreditCard className="h6 w-6" />,
  },
  {
    label: "Bài viết",
    path: "/bai-viet",
    icon: <FaNewspaper className="h6 w-6" />,
  },
  {
    label: "Giới thiệu",
    path: "/gioi-thieu",
    icon:<FaPeopleRoof className="h6 w-6" />,
  },
  // {
  //   label: "Liên hệ",
  //   path: "/lien-he",
  //   icon:<MdOutlineContactPhone  className="h6 w-6" />,
  // }
];