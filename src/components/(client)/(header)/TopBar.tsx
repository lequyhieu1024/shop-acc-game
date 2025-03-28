"use client";
import { useState } from "react";
import { IoHome } from "react-icons/io5";
import { FaShoppingCart, FaCaretDown } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import { menu } from "@/components/(client)/(header)/menu";
import DrawerCommon from "@/components/(client)/(common)/DrawerCommon";
import CartDrawerContent from "@/components/(client)/(common)/CartDrawerContent";
import { useCart } from "@/app/contexts/CartContext";
import { useViewport } from "@/app/hook/useViewport";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {toast} from "react-toastify";

const NavBar = () => {
  const { totalItems } = useCart();
  const { screenSize = "md" } = useViewport();
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const showCartDrawer = () => {
    setCartDrawerVisible(true);
  };

  const closeCartDrawer = () => {
    setCartDrawerVisible(false);
  };

  const handleCheckout = () => {
    if (typeof window !== "undefined") {
      console.log("Proceeding to checkout");
      window.location.href = "/thanh-toan";
    }
    closeCartDrawer();
  };

  console.log(session)

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/dang-nhap");
    toast.success('Đã đăng xuất !')
  };

  return (
      <>
       <nav className="flex items-center bg-blue-500 fixed z-20 w-full shadow-md py-4  select-none">
          <ul className="container mx-auto flex h-full items-center justify-between px-4">
            <div className="flex items-center gap-5 md:gap-16">
              <li>
                <Link href="/" className="text-white hover:text-blue-200 transition-colors">
                  <IoHome className="w-6 h-6" />
                </Link>
              </li>
              {menu.map((menuData, index) => (
                  <li
                      key={index}
                      className="group/root relative flex h-full cursor-pointer items-center transition-colors hover:bg-blue-600 rounded-md"
                  >
                    {menuData.path ? (
                        <Link href={menuData.path} className="flex items-center gap-1 text-white">
                          <span className="md:hidden">{menuData.icon}</span>
                          <span className="hidden md:block uppercase text-sm font-medium tracking-wide hover:text-blue-200 transition-colors">
                      {menuData.label}
                    </span>
                          {menuData.items && <FaCaretDown className="w-4 h-4" />}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1 text-white">
                          <span className="md:hidden">{menuData.icon}</span>
                          <span className="hidden md:block uppercase text-sm font-medium tracking-wide">
                      {menuData.label}
                    </span>
                          {menuData.items && <FaCaretDown className="w-4 h-4" />}
                        </div>
                    )}
                    {menuData.items && (
                        <ul className="absolute left-0 top-full invisible w-[300px] bg-white shadow-lg group-hover/root:visible rounded-md">
                          {menuData.items.map((childMenuData, childIndex) => (
                              <li
                                  key={childIndex}
                                  className="group/1 relative px-4 py-2 hover:bg-gray-100 transition-colors"
                              >
                                {childMenuData.path ? (
                                    <Link href={childMenuData.path} className="text-gray-800">
                                      {childMenuData.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-800">{childMenuData.label}</span>
                                )}
                                {childMenuData.items && (
                                    <ul className="invisible absolute left-full top-0 w-[300px] bg-white shadow-lg group-hover/1:visible rounded-md">
                                      {childMenuData.items.map((subMenuData, subIndex) => (
                                          <li
                                              key={subIndex}
                                              className="group/2 relative px-4 py-2 hover:bg-gray-100 transition-colors"
                                          >
                                            {subMenuData.path ? (
                                                <Link href={subMenuData.path} className="text-gray-800">
                                                  {subMenuData.label}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-800">{subMenuData.label}</span>
                                            )}
                                            {subMenuData.items && (
                                                <ul className="invisible absolute left-full top-0 w-[300px] bg-white shadow-lg group-hover/2:visible rounded-md">
                                                  {subMenuData.items.map((nestedMenuData, nestedIndex) => (
                                                      <li
                                                          key={nestedIndex}
                                                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                                      >
                                                        {nestedMenuData.path ? (
                                                            <Link href={nestedMenuData.path} className="text-gray-800">
                                                              {nestedMenuData.label}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-gray-800">{nestedMenuData.label}</span>
                                                        )}
                                                      </li>
                                                  ))}
                                                </ul>
                                            )}
                                          </li>
                                      ))}
                                    </ul>
                                )}
                              </li>
                          ))}
                        </ul>
                    )}
                  </li>
              ))}
            </div>

            <div className="flex items-center gap-5">
              <div className="relative leading-[12px] cart-icon" data-totalitems={totalItems}>
                <button
                    className="text-white hover:text-blue-200 transition-colors relative"
                    onClick={showCartDrawer}
                >
                  <FaShoppingCart />
                  {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                  )}
                </button>
              </div>

              <div className="group/profile relative flex h-full cursor-pointer items-center transition-colors">
                {session ? (
                    <span className="text-white hover:text-blue-200 transition-colors">
                  <Image
                      src={"/client/assets/images/user_placeholder_image.jpg"}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                  />
                </span>
                ) : (
                    <span className="text-white hover:text-blue-200 transition-colors">
                  <CgProfile />
                </span>
                )}
                <ul className="absolute right-0 top-full invisible w-[150px] bg-white shadow-lg group-hover/profile:visible rounded-md">
                  {session ? (
                      <>
                        <li className="px-5 py-3 hover:bg-gray-100 transition-colors rounded-md">
                          <button onClick={handleLogout} className="text-gray-800">
                            Đăng xuất
                          </button>
                        </li>
                        {session.user.role === "admin" && (
                            <li className="px-5 py-3 hover:bg-gray-100 transition-colors rounded-md">
                              <Link href="/admin/dashboard" className="text-gray-800">
                                Quản trị
                              </Link>
                            </li>
                        )}
                      </>
                  ) : (
                      <>
                        <li className="px-5 py-3 hover:bg-gray-100 transition-colors rounded-md">
                          <Link href="/dang-ky" className="text-gray-800">
                            Đăng ký
                          </Link>
                        </li>
                        <li className="px-5 py-3 hover:bg-gray-100 transition-colors rounded-md">
                          <Link href="/dang-nhap" className="text-gray-800">
                            Đăng nhập
                          </Link>
                        </li>
                      </>
                  )}
                </ul>
              </div>
            </div>
          </ul>
        </nav>

        <DrawerCommon
            screenSize={screenSize}
            open={cartDrawerVisible}
            onClose={closeCartDrawer}
            title="Giỏ hàng của bạn"
            placement="right"
            titleButton="Thanh toán"
            onTitleButtonClick={handleCheckout}
        >
          <CartDrawerContent />
        </DrawerCommon>
      </>
  );
};

export default NavBar;