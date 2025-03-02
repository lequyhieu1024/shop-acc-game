"use client";
import Link from "next/link";
import { FaCaretRight } from "react-icons/fa6";
import { ReactNode } from "react";
import clsx from "clsx";
import { IMenuItem } from "./menu";

export type IChildMenuItem = IMenuItem & {
  children?: ReactNode;
  group: string;
};

const ChildMenuItem = ({
  label,
  items,
  path,
  children,
  group
}: IChildMenuItem) => {
  return (
    <li
      className={clsx(
        "relative flex h-full cursor-pointer items-center p-2 text-black transition-colors hover:bg-gray-200 hover:text-blue-500",
        group
      )}
    >
      <Link href={path || "#"} passHref>
        <div className="flex w-full items-center justify-between gap-2">
          <span>{label}</span>
          {items && <FaCaretRight className="shrink-0" />}
        </div>
      </Link>
      {children}
    </li>
  );
};

export default ChildMenuItem;
