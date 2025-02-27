"use client"
import Link from "next/link";
import api from "@/app/services/axiosService";
import {useEffect, useState} from "react";
import {ISystem} from "@/app/interfaces/ISystem";

export const Navbar = () => {

    const [system, setSystem] = useState<ISystem | null>(null)
    const fetchSystem = async () => {
        try {
            const response = await api.get("/systems");
            if (response.status === 200) {
                setSystem(response.data.system)
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    useEffect(() => {
        fetchSystem()
    }, []);
    return (
        <nav className="sidebar-main">
            <div className="left-arrow" id="left-arrow">
                <i data-feather="arrow-left"></i>
            </div>

            <div id="sidebar-menu">
                <ul className="sidebar-links" id="simple-bar">
                    <li className="back-btn"></li>

                    <li className="sidebar-list">
                        <Link className="sidebar-link sidebar-title link-nav" href="/admin/dashboard">
                            <i className="ri-home-line"></i>
                            <span>Trang chủ</span>
                        </Link>
                    </li>

                    <li className="sidebar-list">
                        <a className="sidebar-link sidebar-title link-nav" href="media.html">
                            <i className="ri-archive-line"></i>
                            <span>Đơn hàng</span>
                        </a>
                    </li>

                    <li className="sidebar-list">
                        <a className="sidebar-link sidebar-title link-nav" href="support-ticket.html">
                            <i className="ri-bank-line"></i>
                            <span>Giao dịch</span>
                        </a>
                    </li>

                    <li className="sidebar-list">
                        <a className="linear-icon-link sidebar-link sidebar-title" href="#">
                            <i className="ri-store-3-line"></i>
                            <span>Tài khoản game</span>
                        </a>
                        <ul className="sidebar-submenu">
                            <li>
                                <Link href="/admin/products">Danh sách</Link>
                            </li>

                            <li>
                                <Link href="/admin/products/create">Thêm mới</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-list">
                        <a className="linear-icon-link sidebar-link sidebar-title" href="#">
                            <i className="ri-list-check-2"></i>
                            <span>Danh mục</span>
                        </a>
                        <ul className="sidebar-submenu">
                            <li>
                                <Link href="/admin/categories">Danh sách</Link>
                            </li>

                            <li>
                                <Link href="/admin/categories/create">Thêm mới</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-list">
                        <a className="sidebar-link sidebar-title" href="#">
                            <i className="ri-user-3-line"></i>
                            <span>Người dùng</span>
                        </a>
                        <ul className="sidebar-submenu">
                            <li>
                                <Link href="all-users.html">Danh sách khách hàng</Link>
                            </li>
                            <li>
                                <Link href="all-users.html">Danh sách quản trị viên</Link>
                            </li>
                            <li>
                                <Link href="add-new-user.html">Thêm mới quản trị viên</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-list">
                        <a className="linear-icon-link sidebar-link sidebar-title" href="#">
                            <i className="ri-coupon-3-line"></i>
                            <span>Voucher</span>
                        </a>
                        <ul className="sidebar-submenu">
                            <li>
                                <Link href="/admin/vouchers">Danh sách</Link>
                            </li>

                            <li>
                                <Link href="/admin/vouchers/create">Thêm mới</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-list">
                        <a className="linear-icon-link sidebar-link sidebar-title" href="#">
                            <i className="ri-gift-2-line"></i>
                            <span>Vòng quay may mắn</span>
                        </a>
                        <ul className="sidebar-submenu">
                            <li>
                                <Link href="/admin/lucky-draws">Danh sách</Link>
                            </li>

                            <li>
                                <Link href="/admin/lucky-draws/create">Thêm mới</Link>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-list">
                        <a className="sidebar-link sidebar-title link-nav" href="/admin/supports">
                            <i className="ri-phone-line"></i>
                            <span>Liên hệ - Hỗ trợ</span>
                        </a>
                    </li>

                    <li className="sidebar-list">
                        <a className="linear-icon-link sidebar-link sidebar-title" href="#">
                            <i className="ri-settings-2-line"></i>
                            <span>Cài đặt</span>
                        </a>
                        <ul className="sidebar-submenu">
                            <li>
                                <Link href="/admin/systems">Hệ thống</Link>
                            </li>
                            <li>
                                <Link href="/admin/banners">Banner</Link>
                            </li>
                            <li>
                                <Link target="_blank" href={system?.youtube ?? "#"}><i className="ri-youtube-line"></i>Đi đến kênh Youtube</Link>
                            </li>
                            <li>
                                <Link target="_blank" href={system?.facebook ?? "#"}><i className="ri-facebook-line"></i>Đi đến kênh Fanpage</Link>
                            </li>
                            <li>
                                <Link target="_blank" href={system?.tiktok ?? "#"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white"
                                         className="bi bi-tiktok" viewBox="0 0 16 16">
                                        <path
                                            d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                                    </svg>
                                    Đi đến kênh Tiktok
                                </Link>
                            </li>

                        </ul>
                    </li>
                </ul>
            </div>

            <div className="right-arrow" id="right-arrow">
                <i data-feather="arrow-right"></i>
            </div>
        </nav>
    )
}