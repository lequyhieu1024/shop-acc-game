"use client";
import React, { useState } from "react";
// import { IoHome } from "react-icons/io5";
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
import SearchInput from "@/components/(client)/(common)/SearchInput";
// import { Modal } from "antd";
import ProfileModal from "@/components/(client)/(common)/ProfileModal";

const NavBar = () => {
  const { totalItems } = useCart();
  const { screenSize = "md" } = useViewport();
  const [cartDrawerVisible, setCartDrawerVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
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
      <nav className="flex items-center bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 fixed z-20 w-full shadow-lg py-0 select-none border-b border-purple-500/20">
        <div className="container mx-auto flex h-[70px] items-center justify-between px-4">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <Link href="/" className="text-white hover:text-purple-400 transition-colors mr-4">
              {/*<IoHome className="w-7 h-7" />*/}
              <Image
                  height={40}
                  width={90}
                  className="rounded-lg border-2 border-purple-500/50"
                  src="/client/assets/images/LOGO.png"
                  alt="Shop cu tí gaming"
              />
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2 rounded-md hover:bg-purple-500/20 transition-colors"
              onClick={toggleMobileMenu}
            >
              <FaBars className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-5 md:gap-8">
              {menu.map((menuData, index) => (
                  <div
                      key={index}
                      className="group/root relative flex h-full cursor-pointer items-center transition-all hover:bg-purple-500/20 py-3 px-3 rounded-lg"
                  >
                    {menuData.path ? (
                        <Link href={menuData.path} className="flex items-center gap-2 text-white">
                          <span className="uppercase text-sm font-bold tracking-wide hover:text-purple-400 transition-colors">
                            {menuData.label}
                          </span>
                          {menuData.items && <FaCaretDown className="w-4 h-4 text-purple-400" />}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 text-white">
                          <span className="uppercase text-sm font-bold tracking-wide">
                            {menuData.label}
                          </span>
                          {menuData.items && <FaCaretDown className="w-4 h-4 text-purple-400" />}
                        </div>
                    )}
                    {menuData.items && (
                        <ul className="absolute left-0 top-full invisible w-[300px] bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl group-hover/root:visible rounded-lg border border-purple-500/20">
                          {menuData.items.map((childMenuData, childIndex) => (
                              <li
                                  key={childIndex}
                                  className="group/1 relative px-4 py-3 hover:bg-purple-500/20 transition-colors"
                              >
                                {childMenuData.path ? (
                                    <Link href={childMenuData.path} className="text-white hover:text-purple-400">
                                      {childMenuData.label}
                                    </Link>
                                ) : (
                                    <span className="text-white">{childMenuData.label}</span>
                                )}
                                {childMenuData.items && (
                                    <ul className="invisible absolute left-full top-0 w-[300px] bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl group-hover/1:visible rounded-lg border border-purple-500/20">
                                      {childMenuData.items.map((subMenuData, subIndex) => (
                                          <li
                                              key={subIndex}
                                              className="group/2 relative px-4 py-3 hover:bg-purple-500/20 transition-colors"
                                          >
                                            {subMenuData.path ? (
                                                <Link href={subMenuData.path} className="text-white hover:text-purple-400">
                                                  {subMenuData.label}
                                                </Link>
                                            ) : (
                                                <span className="text-white">{subMenuData.label}</span>
                                            )}
                                            {subMenuData.items && (
                                                <ul className="invisible absolute left-full top-0 w-[300px] bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl group-hover/2:visible rounded-lg border border-purple-500/20">
                                                  {subMenuData.items.map((nestedMenuData, nestedIndex) => (
                                                      <li
                                                          key={nestedIndex}
                                                          className="px-4 py-3 hover:bg-purple-500/20 transition-colors"
                                                      >
                                                        {nestedMenuData.path ? (
                                                            <Link href={nestedMenuData.path} className="text-white hover:text-purple-400">
                                                              {nestedMenuData.label}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-white">{nestedMenuData.label}</span>
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

          {/* Search Input */}
          <div className="hidden md:block flex-1 max-w-xl mx-4">
            <SearchInput />
          </div>

          {/* Cart and Profile Icons */}
          <div className="flex items-center gap-6">
            {session?.user && (
                <div className="hidden sm:flex items-center space-x-3 p-3 bg-purple-500/20 rounded-lg">
                  <div className="text-sm text-white font-bold">Số dư:</div>
                  <div className="text-sm text-white font-bold">
                    {loading ? (
                        "Đang tải..."
                    ) : (
                        `${balance.toLocaleString()} đ`
                    )}
                  </div>
                  <button
                      onClick={refreshBalance}
                      className="text-purple-400 hover:text-purple-300 block"
                      title="Cập nhật số dư"
                  >
                    <FaSyncAlt size={14} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
            )}
            <div className="relative leading-[12px] cart-icon" data-totalitems={totalItems}>
              <button
                className="text-white hover:text-purple-400 transition-colors relative bg-purple-500/20 p-2 rounded-lg"
                onClick={showCartDrawer}
              >
                <FaShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            <div className="group/profile relative flex h-full cursor-pointer items-center transition-colors">
              {session ? (
                <span className="text-white hover:text-purple-400 transition-colors">
                  <Image
                    src={"/client/assets/images/user_placeholder_image.jpg"}
                    alt="Shopcutigaming"
                    width={40}
                    height={40}
                    className="rounded-lg border-2 border-purple-500/50"
                  />
                </span>
              ) : (
                <span className="text-white hover:text-purple-400 transition-colors bg-purple-500/20 p-2 rounded-lg">
                  <CgProfile className="w-6 h-6" />
                </span>
              )}
              <ul className="absolute right-0 top-full invisible w-[200px] bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl group-hover/profile:visible rounded-lg border border-purple-500/20">
                {session ? (
                    <>
                      <li className="sm:hidden px-5 py-3 hover:bg-purple-500/20 transition-colors">
                        <div className="flex items-center space-x-2">
                          <div className="text-[16px] text-purple-400 font-bold">
                            {loading ? (
                                "Đang tải..."
                            ) : (
                                `${balance.toLocaleString()} đ`
                            )}
                          </div>
                          <button
                              onClick={refreshBalance}
                              className="text-purple-400 hover:text-purple-300 block"
                              title="Cập nhật số dư"
                          >
                            <FaSyncAlt size={14} className={loading ? "animate-spin" : ""}/>
                          </button>
                        </div>
                      </li>
                      {session.user.role === "admin" && (
                          <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                            <Link href="/admin/dashboard" className="text-white hover:text-purple-400 font-medium">
                              Truy cập admin
                            </Link>
                          </li>
                      )}
                      <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                        <Link href="/don-hang-cua-toi" className="text-white hover:text-purple-400 font-medium">
                          Đơn hàng của tôi
                        </Link>
                      </li>
                      <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                        <Link href="/nap-the#lich-su-nap" className="text-white hover:text-purple-400 font-medium">
                          Lịch sử nạp thẻ
                        </Link>
                      </li>
                      <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                        <button 
                          onClick={() => setProfileModalVisible(true)} 
                          className="text-white hover:text-purple-400 font-medium w-full text-left"
                        >
                          Thông tin cá nhân
                        </button>
                      </li>
                      <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                        <button onClick={handleLogout} className="text-white hover:text-purple-400 font-medium">
                          Đăng xuất
                        </button>
                      </li>
                    </>
                ) : (
                    <>
                      <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                        <Link href="/dang-ky" className="text-white hover:text-purple-400 font-medium">
                          Đăng ký
                        </Link>
                    </li>
                    <li className="px-5 py-3 hover:bg-purple-500/20 transition-colors">
                      <Link href="/dang-nhap" className="text-white hover:text-purple-400 font-medium">
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
        <div className={`md:hidden fixed top-[73px] left-0 w-full bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-lg transition-all duration-300 ease-in-out mobile-menu ${mobileMenuVisible ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {/* Add Search Input to Mobile Menu */}
          <div className="p-3 border-b border-purple-500/20">
            <SearchInput />
          </div>
          <ul className="p-3">
            {menu.map((menuData, index) => (
              <li key={index} className="mobile-menu-item hover:bg-purple-500/20 py-1 transition-colors">
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

      <ProfileModal 
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </>
  );
};

export default NavBar;