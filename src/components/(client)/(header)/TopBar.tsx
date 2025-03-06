"use client";
import { FaCaretDown } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { BsBellFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { menu } from "./menu";
import ChildMenuItem from "./ChildMenuItem";
import { useEffect, useRef } from "react";
import { useCart } from "@/app/contexts/CartContext";
import './header.css'

const NavBar = () => {
  const parentRef = useRef<HTMLLIElement>(null);
  const firstChildRef = useRef<HTMLUListElement>(null);
  const secondChild = useRef<HTMLUListElement>(null);
  const thirdChild = useRef<HTMLUListElement>(null);
  const { totalItems } = useCart();
  useEffect(() => {
    console.log(parentRef.current?.offsetLeft);
    console.log(
      firstChildRef.current?.offsetLeft,
      firstChildRef.current?.offsetWidth
    );
    const res = document.body.clientWidth;
    console.log("🦎 ~ NavBar ~ res:", res);
  }, []);

  return (
    <nav className="flex h-[50px] select-none items-center bg-blue-500 fixed z-20  w-full">
      <ul className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-[30px]">
          {/* Home Link */}
          <li>
            <Link href="/" className="text-2xl text-white">
              <IoHome />
            </Link>
          </li>
          {menu.map((menuData, index) => (
            <li
              ref={parentRef}
              key={index}
              className="group/root relative flex h-full cursor-pointer items-center px-2 transition-colors hover:bg-blue-600"
            >
              {/* Nếu có đường dẫn, bọc trong Link, nếu không thì chỉ là span */}
              <div className="flex items-center gap-2 text-white">
                {menuData.path ? (
                  <Link href={menuData.path} className="uppercase">
                    {menuData.label}
                  </Link>
                ) : (
                  <span className="uppercase">{menuData.label}</span>
                )}
                {menuData.items && <FaCaretDown />}
              </div>

              {/* Hiển thị menu con nếu có */}
              {menuData.items && (
                <ul
                  ref={firstChildRef}
                  className="absolute left-0 top-full invisible w-[300px] bg-white shadow group-hover/root:visible"
                >
                  {menuData.items.map((childMenuData, childIndex) => (
                    <ChildMenuItem key={childIndex} {...childMenuData} group="group/1">
                      {childMenuData.items && (
                        <ul
                          ref={secondChild}
                          className="invisible absolute left-full top-0 w-[300px] bg-white shadow group-hover/1:visible"
                        >
                          {childMenuData.items.map((subMenuData, subIndex) => (
                            <ChildMenuItem key={subIndex} {...subMenuData} group="group/2">
                              {subMenuData.items && (
                                <ul
                                  ref={thirdChild}
                                  className="invisible absolute left-full top-0 w-[300px] bg-white shadow group-hover/2:visible"
                                >
                                  {subMenuData.items.map((nestedMenuData, nestedIndex) => (
                                    <ChildMenuItem key={nestedIndex} {...nestedMenuData} group="group/3" />
                                  ))}
                                </ul>
                              )}
                            </ChildMenuItem>
                          ))}
                        </ul>
                      )}
                    </ChildMenuItem>
                  ))}
                </ul>
              )}
            </li>
          ))}

        </div>
        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <button className="text-white text-xl">
            <BsBellFill />
          </button>
          <div className="relative leading-[12px] cart-icon" data-totalitems={totalItems}>
            <button className="text-white text-xl">
              <FaShoppingCart />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
              </span>
            </button>
          </div>
          <button className="text-white text-2xl">
            <CgProfile />
          </button>
          <button className="bg-white text-blue-500 px-3 py-1 rounded-md font-semibold">
            Nạp Tiền
          </button>
        </div>
      </ul>
    </nav>
  );
};

export default NavBar;