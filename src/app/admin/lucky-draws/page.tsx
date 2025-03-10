"use client";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import Link from "next/link";
import { Space, Table, TableProps, Tag } from "antd";
import React, { useEffect, useState } from "react";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import DeleteConfirm from "@/components/DeleteConfirm";
import { DateTimeISO8601ToUFFAndUTCP7 } from "@/app/services/commonService";
import {ILuckyDraw} from "@/app/interfaces/ILuckyDraw";

export default function LuckyDraws() {
    const [luckyDraws, setLuckyDraws] = useState<ILuckyDraw[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const fetchLuckyDraws = async () => {
        try {
            const response = await api.get("lucky-draws");
            if (response.status === 200) {
                setLuckyDraws(response.data.luckyDraws || []);
                setError(false);
            } else {
                setError(true);
            }
        } catch (e) {
            console.error("Error fetching lucky draws:", e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: number) => {
        try {
            const res = await api.delete(`lucky-draws/${id}`);
            if (res.status === 200) {
                toast.success("Xóa vòng quay may mắn thành công");
                await fetchLuckyDraws();
            } else {
                toast.error("Xóa vòng quay may mắn thất bại");
            }
        } catch (e) {
            setError(true);
            toast.error("Đã có lỗi xảy ra khi xóa vòng quay may mắn");
            console.error("Error deleting lucky draw:", (e as Error).message);
        }
    };

    useEffect(() => {
        fetchLuckyDraws();
    }, []);

    const columns: TableProps<ILuckyDraw>["columns"] = [
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (text: string) => {
                const typeMap: { [key: string]: string } = {
                    voucher: "Voucher",
                    diamond: "Kim cương",
                    acc_game: "Tài khoản game",
                    combine: "Kết hợp",
                };
                return typeMap[text] || text;
            },
        },
        {
            title: "Thời hạn vòng quay",
            key: "issue_date",
            render: (record: ILuckyDraw) => (
                <span>
                    {record.issue_date && record.expired_date ? (
                        <>
                            {DateTimeISO8601ToUFFAndUTCP7(record.issue_date)}{" "}
                            <strong>-</strong>{" "}
                            {DateTimeISO8601ToUFFAndUTCP7(record.expired_date)}
                        </>
                    ) : (
                        "Không có thời hạn"
                    )}
                </span>
            ),
        },
        {
            title: "Giá",
            key: "amount_draw",
            render: (record: ILuckyDraw) => (
                <div className="d-flex flex-column">
                    <span>{record.amount_draw.toLocaleString("vi-VN")} đ</span>
                </div>
            ),
        },
        {
            title: "Chấp nhận vé quay miễn phí ?",
            key: "accept_draw",
            render: (record: ILuckyDraw) => (
                <div className="d-flex flex-column">
                    <span>{record.accept_draw ? "Có" : "Không"} đ</span>
                </div>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (record: ILuckyDraw) => (
                <Space size="middle">
                    <Link href={`/admin/lucky-draws/${record.id}`}>
                        <i className="ri-pencil-line"></i>
                    </Link>
                    <DeleteConfirm onConfirm={() => onDelete(record.id)} />
                </Space>
            ),
        },
    ];

    return loading ? (
        <Loading />
    ) : error ? (
        <ErrorPage />
    ) : (
        <div className="row">
            <div className="col-sm-12">
                <div className="card card-table">
                    <div className="card-body">
                        <div className="title-header option-title">
                            <h5>Tất Cả Vòng Quay May Mắn</h5>
                            <form className="d-inline-flex">
                                <Link
                                    href="/admin/lucky-draws/create"
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
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="8" y1="12" x2="16" y2="12"></line>
                                    </svg>
                                    Thêm Mới
                                </Link>
                            </form>
                        </div>

                        <div className="table-responsive product-table">
                            <div>
                                <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                                    <Table
                                        columns={columns}
                                        dataSource={luckyDraws}
                                        rowKey="id"
                                        className="theme-table"
                                        bordered
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}