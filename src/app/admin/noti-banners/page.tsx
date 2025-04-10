"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import { DateTimeISO8601ToUFFAndUTCP7 } from "@/app/services/commonService";
import { toast } from "react-toastify";
import DeleteConfirm from "@/components/DeleteConfirm";
import Image from "next/image";
import { INotificationBanner } from "@/app/interfaces/INotificationBanner";
import Swal from "sweetalert2";
import { Switch } from "antd";

export default function NotificationBannerPage() {
    const [banners, setBanners] = useState<INotificationBanner[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const getBanners = async () => {
        try {
            const response = await api.get("noti-banners");
            if (response.status === 200) {
                setBanners(response.data.banners || []);
            }
            setError(false);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const res = await api.delete(`/noti-banners/${id}`);
            if (res) {
                setMessage("Xóa banner thành công");
                await getBanners();
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    const changeStatus = async (id: number) => {
        await api.patch(`noti-banners/${id}/change-status`);
        getBanners();
        toast.success("Thay đổi trạng thái thành công");
    };

    useEffect(() => {
        getBanners();
        const msg = sessionStorage.getItem("message");
        if (msg) {
            setMessage(msg);
            sessionStorage.removeItem("message");
        }
    }, []);

    useEffect(() => {
        if (message) {
            toast.success(message);
        }
    }, [message]);
    const handleToggleHandler = (ntb: INotificationBanner) => {
        Swal.fire({
            html: `
            <div class="text-base font-semibold mb-2">Bạn có chắc muốn thay đổi phản hồi cho "${ntb.title}"?</div>
            <p class="text-sm">Trạng thái sẽ chuyển từ ${ntb.is_active ? "Đã phản hồi" : "Chưa phản hồi"} sang ${!ntb.is_active ? "Đã phản hồi" : "Chưa phản hồi"}.</p>
          `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Huỷ",
            customClass: {
                icon: "text-[18px]", // 👈 icon nhỏ lại
              },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.patch(`noti-banners/${ntb.id}/change-status`);
                    toast.success("Cập nhật phản hồi thành công.");
                    getBanners(); // gọi lại để refresh data
                } catch (error) {
                    toast.error("Có lỗi xảy ra khi cập nhật.");
                }
            }
        });
    };

    return loading ? (
        <Loading />
    ) : !error ? (
        <div className="row">
            <div className="col-sm-12">
                <div className="card card-table">
                    <div className="card-body">
                        <div className="title-header option-title">
                            <h5>Tất cả thông báo nổi</h5>
                            <form className="d-inline-flex">
                                <Link
                                    href="/admin/noti-banners/create"
                                    className="align-items-center btn btn-theme d-flex"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-plus-square"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                    Thêm mới
                                </Link>
                            </form>
                        </div>

                        <div className="table-responsive banner-table">
                            <div className="dataTables_wrapper no-footer" id="table_id_wrapper">
                                <table className="table all-package theme-table" id="table_id">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tiêu đề</th>
                                            <th>Trạng thái</th>
                                            <th>Ảnh</th>
                                            <th>Bắt đầu</th>
                                            <th>Kết thúc</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {banners.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-5">
                                                    <h5>No data</h5>
                                                </td>
                                            </tr>
                                        ) : (
                                            banners.map((banner: INotificationBanner) => (
                                                <tr key={banner.id}>
                                                    <td>{banner.id}</td>
                                                    <td>{banner.title}</td>
                                                    <td>
                                                        <Switch
                                                            checked={banner.is_active}
                                                            onChange={() => handleToggleHandler(banner)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Image
                                                            width={80}
                                                            height={80}
                                                            src={banner.image_url || "/admin/assets/images/placeholder.png"}
                                                            alt={banner.title}
                                                        />
                                                    </td>
                                                    <td>{banner.start_time ? DateTimeISO8601ToUFFAndUTCP7(banner.start_time) : "-"}</td>
                                                    <td>{banner.end_time ? DateTimeISO8601ToUFFAndUTCP7(banner.end_time) : "-"}</td>
                                                    <td>{banner.created_at ? DateTimeISO8601ToUFFAndUTCP7(banner.created_at) : "-"}</td>
                                                    <td>
                                                        <ul>
                                                            <li>
                                                                <Link href={`/admin/noti-banners/${banner.id}`}>
                                                                    <i className="ri-pencil-line"></i>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <DeleteConfirm onConfirm={() => handleDelete(banner.id)} />
                                                            </li>
                                                        </ul>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <h3>Có lỗi xảy ra!</h3>
    );
}
