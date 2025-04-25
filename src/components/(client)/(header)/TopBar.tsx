"use client";
import { useState } from "react";
import { IoHome } from "react-icons/io5";
import { FaShoppingCart, FaCaretDown, FaSyncAlt, FaBars } from "react-icons/fa";
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
import { toast } from "react-toastify";
import { useBalance } from "@/app/hooks/useBalance";

const NavBar = () => {
  const { totalItems } = useCart();
  const { screenSize = "md" } = useViewport();
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { data: session } = useSession();
  const { balance, loading, refreshBalance } = useBalance();
  const router = useRouter();

  const showCartDrawer = () => {
    setCartDrawerVisible(true);
  };

  const closeCartDrawer = () => {
    setCartDrawerVisible(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleCheckout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/thanh-toan";
    }
    closeCartDrawer();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/dang-nhap");
    toast.success('Đã đăng xuất !')
  };

  return (
    <>
      <nav className="flex items-center bg-blue-500 fixed z-20 w-full shadow-md py-0 select-none">
        <div className="container mx-auto flex h-[60px] items-center justify-between px-4">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <Link href="/" className="text-white hover:text-blue-200 transition-colors mr-4">
              <IoHome className="w-6 h-6" />
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              <FaBars className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center gap-5 md:gap-8">
              {menu.map((menuData, index) => (
                  <div
                      key={index}
                      className="group/root relative flex h-full cursor-pointer items-center transition-colors hover:bg-blue-600 py-3 px-2 rounded-md"
                  >
                    {menuData.path ? (
                        <Link href={menuData.path} className="flex items-center gap-1 text-white">
                    <span className="uppercase text-sm font-medium tracking-wide hover:text-blue-200 transition-colors">
                      {menuData.label}
                    </span>
                          {menuData.items && <FaCaretDown className="w-4 h-4" />}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1 text-white">
                    <span className="uppercase text-sm font-medium tracking-wide">
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
                  </div>
              ))}
            </div>
          </div>

          {/* Cart and Profile Icons */}
          <div className="flex items-center gap-5">
            {session?.user && (
                <div className="hidden sm:flex items-center space-x-2 p-4">
                  <div className="text-sm text-white font-semibold">Số dư:</div>
                  <div className="text-sm text-white font-semibold">
                    {loading ? (
                        "Đang tải..."
                    ) : (
                        `${balance.toLocaleString()} đ`
                    )}
                  </div>
                  <button
                      onClick={refreshBalance}
                      className="text-white hover:text-gray-300 block"
                      title="Cập nhật số dư"
                  >
                    <FaSyncAlt size={13} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
            )}
            <div className="relative leading-[12px] cart-icon" data-totalitems={totalItems}>
              <button
                className="text-white hover:text-blue-200 transition-colors relative"
                onClick={showCartDrawer}
              >
                <FaShoppingCart className="w-5 h-5" />
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
                  <CgProfile className="w-5 h-5" />
                </span>
              )}
              <ul className="absolute right-0 top-full invisible w-[150px] bg-white shadow-lg group-hover/profile:visible rounded-md">
                {session ? (
                  <>
                    <li className="sm:hidden px-5 py-3 hover:bg-gray-100 transition-colors rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className="text-[16px] text-gray-800">
                          {loading ? (
                            "Đang tải..."
                          ) : (
                            `${balance.toLocaleString()} đ`
                          )}
                        </div>
                        <button
                          onClick={refreshBalance}
                          className="hover:text-gray-300 block"
                          title="Cập nhật số dư"
                        >
                          <FaSyncAlt size={13} className={loading ? "animate-spin" : "" + "text-gray-500"} />
                        </button>
                      </div>
                    </li>
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
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed top-[63px] left-0 w-full bg-blue-500 shadow-lg transition-all duration-300 ease-in-out mobile-menu ${mobileMenuVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <ul className="p-3">
            {menu.map((menuData, index) => (
              <li key={index} className="mobile-menu-item hover:bg-blue-600 py-1 transition-colors">
                <Link href={menuData.path || '#'} className="flex items-center gap-2 text-white">
                  <span className="mobile-menu-icon">{menuData.icon}</span>
                  <span className="mobile-menu-text">{menuData.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
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
        <CartDrawerContent setCartDrawerVisible={setCartDrawerVisible} />
      </DrawerCommon>
    </>
  );
};

export default NavBar;