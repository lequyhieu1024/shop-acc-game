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
    label: "Trang chủ"
  },
  {
    label: "Danh mục"
  },
  {
    label: "Nạp thẻ"
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
