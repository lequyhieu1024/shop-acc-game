"use client"
import Link from "next/link";
import React, {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import {DateTimeISO8601ToUFFAndUTCP7} from "@/app/services/commonService";
import {toast} from "react-toastify";
import DeleteConfirm from "@/components/DeleteConfirm";
import Image from "next/image";
import {IBanner} from "@/app/interfaces/IBanner";

export default function BannerPage() {

    const [banners, setBanners] = useState<IBanner[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")

    const getBanners = async () => {
        try {
            const response = await api.get('banners');
            if (response.status === 200) {
                setBanners(response.data.banners || [])
            }
            setError(false)
        } catch {
            console.log("error")
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const res = await api.delete(`/banners/${id}`)
            if (res) {
                setMessage("Xóa banner thành công");
                await getBanners();
            }
        } catch (e) {
            console.log((e as Error).message)
        }
    }

    const changeStatus = async (id: number) => {
        await api.patch(`banners/${id}/change-status`);
        getBanners();
        toast.success("Thành công");
    }

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

    return (
        loading ? (<Loading/>) : (
            !error ? (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table">
                            <div className="card-body">
                                <div className="title-header option-title">
                                    <h5>Tất cả banner</h5>
                                    <form className="d-inline-flex">
                                        <Link href="/admin/banners/create"
                                              className="align-items-center btn btn-theme d-flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                 strokeLinecap="round" strokeLinejoin="round"
                                                 className="feather feather-plus-square">
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
                                                <th>Trạng thái</th>
                                                <th>Ảnh</th>
                                                <th>Ngày tạo</th>
                                                <th>Thao tác</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {
                                                banners.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="p-5">
                                                            <h5>No data</h5>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    banners.map((banner: IBanner) => (
                                                        <tr key={banner.id}>
                                                            <td>{banner.id}</td>
                                                            <td>
                                                                <div className="form-check form-switch d-flex justify-content-center">
                                                                    <input className="form-check-input" checked={banner.is_active} onChange={() =>changeStatus(banner.id)} type="checkbox" id="flexSwitchCheckDefault"/>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Image
                                                                    width={200}
                                                                    height={200}
                                                                    src={banner.image_url || "/admin/assets/images/placeholder.png"}
                                                                    alt={banner.image_url}
                                                                    layout="intrinsic"
                                                                />
                                                            </td>

                                                            <td>{DateTimeISO8601ToUFFAndUTCP7(banner.created_at)}</td>

                                                            <td>
                                                                <ul>
                                                                    {/*<li>*/}
                                                                    {/*    <a href="order-detail.html">*/}
                                                                    {/*        <i className="ri-eye-line"></i>*/}
                                                                    {/*    </a>*/}
                                                                    {/*</li>*/}

                                                                    <li>
                                                                        <Link href={`/admin/banners/${banner.id}`}>
                                                                            <i className="ri-pencil-line"></i>
                                                                        </Link>
                                                                    </li>

                                                                    <li>
                                                                        <DeleteConfirm
                                                                            onConfirm={() => handleDelete(banner.id)}/>
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h3>Some thing were wrong</h3>
            )
        )
    )
}