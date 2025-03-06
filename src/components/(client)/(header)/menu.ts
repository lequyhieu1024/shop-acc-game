type BaseMenuItem = {
  label: string;
};

type WithPath = BaseMenuItem & {
  path: string;
  items?: never;
};

type WithChildren = BaseMenuItem & {
  items?: IMenuItem[];
  path?: never;
};

export type IMenuItem = WithPath | WithChildren;

export const menu: IMenuItem[] = [
  {
    label: "Trang chủ",
    path: "/"
  },
  {
    label: "Danh mục",
    path: "/dich-vu"
  },
  {
    label: "Nạp thẻ",
    path: "/nap-the"
  },
  {
    label: "Tin tức"
  },
  {
    label: "Giới thiệu"
  },
  {
    label: "Liên hệ"
  }
];
