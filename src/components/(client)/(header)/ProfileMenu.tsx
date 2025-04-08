"use client";

import { Dropdown, MenuProps } from "antd";
import { CgProfile } from "react-icons/cg";
import { FaRegUser, FaCodeBranch } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
    name: string;
    avatar: string;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ name, avatar }) => {
    const router = useRouter();

    const menuItems: MenuProps["items"] = [
        {
            key: "profile-info",
            label: (
                <div className="flex items-center gap-3 p-4 border-b">
                    <Image
                        src={avatar || "/default-avatar.jpg"}
                        alt="Profile Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">{name}</p>
                        <p className="text-xs text-gray-500">Set status</p>
                    </div>
                </div>
            ),
            disabled: true, // Không cho click vào phần info
        },
        {
            key: "profile",
            label: "Tài khoản",
            icon: <FaRegUser className="text-blue-500" />,
            onClick: () => {
                router.push('/tai-khoan');
            }
        },
        {
            key: "order",
            label: "Đơn hàng của bạn",
            icon: <FaCodeBranch className="text-blue-500" />,
        },
        {
            key: "logout",
            label: "Đăng xuất",
            icon: <RiLogoutBoxRLine className="text-blue-500" />,
            onClick: () => {
                router.push('/dang-nhap');
            }
        },

    ];

    return (
        <Dropdown menu={{ items: menuItems }} trigger={["hover"]} placement="bottomRight">
            <button className="text-white hover:text-blue-200 transition-colors">
                <CgProfile />
            </button>
        </Dropdown>
    );
};

export default ProfileMenu;
