import { FaList, FaCreditCard, FaNewspaper } from "react-icons/fa";
import {SlEnvolopeLetter} from "react-icons/sl";
import {FaPeopleRoof} from "react-icons/fa6";

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
    label: "Tin tức",
    path: "/tin-tuc",
    icon: <FaNewspaper className="h6 w-6" />,
  },
  {
    label: "Giới thiệu",
    path: "/gioi-thieu",
    icon:<FaPeopleRoof className="h6 w-6" />,
  },
  {
    label: "Liên hệ",
    path: "/lien-he",
    icon: <SlEnvolopeLetter className="h6 w-6" />,
  },
];