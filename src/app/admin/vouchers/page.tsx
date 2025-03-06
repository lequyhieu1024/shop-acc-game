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
import {Space, Table, TableProps, Tag} from "antd";

export default function Voucher() {

    const [loading, setLoading] = useState<boolean>(true)
    const [vouchers, setVouchers] = useState<IVoucher[]>([])
    const [error, setError] = useState<boolean>(false)

    const onDelete = async (id: number) => {
        try {
            const res = await api.delete(`vouchers/${id}`)
            if (res) {
                sessionStorage.setItem("message", "Xóa voucher thành công");
                showMessage();
                await fetchVouchers();
            }
        } catch (e) {
            console.log((e as Error).message)
        }
    }

    const fetchVouchers = async (data: string | null = null, size: number | null = 20) => {
        try {
            let url = 'vouchers?';
            if (data) url += `data=${data}&`
            if (size) url += `size=${size}&`
            const response = await api.get(url);
            if (response.status === 200) {
                setVouchers(response.data.vouchers || [])
                setError(false)
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

    const showMessage = () => {
        const msg = sessionStorage.getItem("message");
        if (msg) {
            toast.success(msg);
            sessionStorage.removeItem("message");
        }
    };

    useEffect(() => {
        fetchVouchers();
        showMessage();
    }, []);

    const columns: TableProps<IVoucher>['columns'] = [
        {
            title: "Tên sự kiện",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Giá trị giảm",
            dataIndex: "value",
            key: "value",
            render: (value: number) => `${value.toLocaleString()} VND`,
        },
        {
            title: "Thời hạn voucher",
            key: "issue_date",
            render: (voucher: IVoucher) => (
                <span>
                    {DateTimeISO8601ToUFFAndUTCP7(voucher.issue_date)} <strong>-</strong> {DateTimeISO8601ToUFFAndUTCP7(voucher.expired_date)}
                </span>
            )
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={type === "private" ? "volcano" : "blue"}>{type.toUpperCase()}</Tag>
            ),
        },
        {
            title: "Mã",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (voucher) => (
                <Space size="middle">
                    <Link href={`/admin/vouchers/${voucher.id}`}>
                        <i className="ri-pencil-line"></i>
                    </Link>
                    <DeleteConfirm onConfirm={() => onDelete(voucher.id)} />
                </Space>
            ),
        },
    ];

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
                                    <h5>Danh sách voucher</h5>
                                    <div className="right-options">
                                        <ul>
                                            <li>
                                                <Link href="/admin/vouchers/create"
                                                      className="align-items-center btn btn-theme d-flex">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                         viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                         strokeWidth="2"
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
                                            <div>
                                                <Table columns={columns} className={`theme-table`} bordered
                                                   dataSource={vouchers.map((voucher) => ({ ...voucher, key: voucher.id }))}
                                                   locale={{ emptyText: "Không có dữ liệu" }}
                                                />
                                            </div>
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