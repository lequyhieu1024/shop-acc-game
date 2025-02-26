"use client"
import {FormSearch} from "@/components/(admin)/(form)/FormSeach";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {IVoucher} from "@/app/interfaces/IVoucher";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import {DateTimeISO8601ToUFFAndUTCP7} from "@/app/services/commonService";
import DeleteConfirm from "@/components/DeleteConfirm";
import {toast} from "react-toastify";

export default function Voucher() {

    const [loading, setLoading] = useState<boolean>(true)
    const [vouchers, setVouchers] = useState<IVoucher[]>([])
    const [error, setError] = useState<boolean>(false)
    const [message, setMessage] = useState<string>("")

    const onDelete = async () => {
        console.log('search')
    }

    const fetchVouchers = async (data: string | null = null, size: number | null = 20) => {
        try {
            let url = 'vouchers?';
            if (data) url += `data=${data}&`
            if (size) url += `size=${size}&`
            const response = await api.get(url);
            if (response.status === 200) {
                setVouchers(response.data.vouchers || [])
            } else {
                setError(true)
            }
        } catch (e) {
            console.log(e)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVouchers();
        const msg = sessionStorage.getItem("message");
        if (msg) setMessage(msg);
        sessionStorage.removeItem("message")
    }, []);

    useEffect(() => {
        if (message) toast.success(message);
    }, [message]);

    return (
        loading ? (
            <Loading/>
        ) : (
            error ? (
                <ErrorPage/>
            ) : (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table">
                            <div className="card-body">
                                <div className="title-header option-title">
                                    <h5>Coupon List</h5>
                                    <div className="right-options">
                                        <ul>
                                            <li>
                                                <Link href="/admin/vouchers/create"
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
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <div className="table-responsive">
                                        <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                                            <FormSearch onSearch={fetchVouchers}/>
                                            <table
                                                className="table all-package coupon-list-table table-hover theme-table dataTable no-footer"
                                                id="table_id">
                                                <thead>
                                                <tr>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.656}}>Tên
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.656}}>Mã
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.656}}>Giá trị
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.656}}>Loại
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.719}}>Số lượng
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.719}}>Thời hạn
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.719}}>Trạng thái
                                                    </th>
                                                    <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                        style={{width: 224.719}}>Hành động
                                                    </th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {
                                                    vouchers.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={5} className="p-5">
                                                                <h5>No data</h5>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        vouchers.map((voucher: IVoucher) => (
                                                            <tr className="odd" key={voucher.id}>
                                                                <td>{voucher.name}</td>
                                                                <td>{voucher.code}</td>
                                                                <td>{voucher.value} vnđ</td>
                                                                <td className="menu-status">
                                                                    <span
                                                                        className={voucher.type === 'public' ? "success" : "danger"}>{voucher.type === 'public' ? "Công khai" : "Nội bộ"}</span>
                                                                </td>
                                                                <td>{voucher.quantity}</td>
                                                                <td>{DateTimeISO8601ToUFFAndUTCP7(voucher.issue_date) + "-" + DateTimeISO8601ToUFFAndUTCP7(voucher.expired_date)}</td>
                                                                <td className="menu-status">
                                                                    <span
                                                                        className={voucher.status === 'active' ? "success" : "danger"}>{voucher.status === 'active' ? "Hoạt động" : "Không hoạt động"}</span>
                                                                </td>
                                                                <td>
                                                                    <ul>
                                                                        <li>
                                                                            <Link
                                                                                href={`/admin/vouchers/${voucher.id}`}>
                                                                                <i className="ri-pencil-line"></i>
                                                                            </Link>
                                                                        </li>

                                                                        <li>
                                                                            <DeleteConfirm
                                                                                onConfirm={() => onDelete()}/>
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
                </div>
            )
        )
    )
}