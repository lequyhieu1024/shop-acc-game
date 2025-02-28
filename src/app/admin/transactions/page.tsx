"use client"
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {ITransaction} from "@/app/interfaces/ITransaction";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import {Input, Space, Table, TableProps, Tag, Form, Button, Select} from "antd";
import {CardStatus} from "@/app/models/entities/CardTransaction";

export default function Transaction() {

    const [loading, setLoading] = useState<boolean>(true)
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [error, setError] = useState<boolean>(false)
    const [form] = Form.useForm();
    const fetchTransactions = async (filters: Record<string, any> = {}, size: number = 20, page: number = 1) => {
        try {
            const params = new URLSearchParams({
                size: size.toString(),
                page: page.toString(),
            });

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value.toString());
            });

            const response = await api.get(`transactions?${params.toString()}`);

            if (response.status === 200) {
                setTransactions(response.data.transactions || []);
                setError(false);
            } else {
                setError(true);
            }
        } catch (e) {
            console.error(e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchTransactions();
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const columns: TableProps<ITransaction>['columns'] = [
        {
            title: "Mã yêu cầu",
            dataIndex: "request_id",
            key: "request_id",
        },
        {
            title: "Nhà mạng",
            dataIndex: "telco",
            key: "telco",
        },
        {
            title: "Giá trị khai báo",
            dataIndex: "declared_value",
            key: "declared_value",
            render: (value: number | null) => (value ? `${value.toLocaleString()} VND` : "-"),
        },
        {
            title: "Giá trị thực nhận",
            dataIndex: "value",
            key: "value",
            render: (value: number | null) => (value ? `${value.toLocaleString()} VND` : "-"),
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `${amount.toLocaleString()} VND`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: number) => {
                const statusMap: Record<CardStatus, { label: string; color: string }> = {
                    [CardStatus.SUCCESS_CORRECT]: { label: "SUCCESS_CORRECT", color: "green" },
                    [CardStatus.SUCCESS_INCORRECT]: { label: "SUCCESS_INCORRECT", color: "blue" },
                    [CardStatus.FAILED]: { label: "FAILED", color: "red" },
                    [CardStatus.MAINTENANCE]: { label: "MAINTENANCE", color: "orange" },
                    [CardStatus.PENDING]: { label: "PENDING", color: "gold" },
                    [CardStatus.SUBMIT_FAILED]: { label: "SUBMIT_FAILED", color: "purple" },
                };
                const { label, color } = statusMap[status as CardStatus] || { label: "Không xác định", color: "gray" };
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at: Date) => new Date(created_at).toLocaleString(),
        },
        {
            title: "Hành động",
            key: "action",
            render: (transaction: ITransaction) => (
                <Space size="middle">
                    <Link href={`/admin/transactions/${transaction.id}`}>
                        <i className="ri-eye-line"></i>
                    </Link>
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
                                    <h5>Danh sách giao dịch</h5>
                                </div>
                                <div>
                                    <div className="table-responsive">
                                        <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                                            <div>
                                                <Form layout="inline" form={form} onFinish={handleSearch} className={`mb-3`}>
                                                    <Form.Item name="user_code">
                                                        <Input placeholder="Mã người dùng" />
                                                    </Form.Item>
                                                    <Form.Item name="status">
                                                        <Select placeholder="Trạng thái" style={{ width: 150 }}>
                                                            <Select.Option value="pending">Pending</Select.Option>
                                                            <Select.Option value="completed">Completed</Select.Option>
                                                            <Select.Option value="failed">Failed</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item name="value">
                                                        <Input placeholder="Giá trị" type="number" />
                                                    </Form.Item>
                                                    <Form.Item>
                                                        <Space>
                                                            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
                                                            <Button onClick={() => form.resetFields()}>Reset</Button>
                                                        </Space>
                                                    </Form.Item>
                                                </Form>
                                                <Table
                                                    columns={columns}
                                                    dataSource={transactions.map((transaction) => ({ ...transaction, key: transaction.id }))}
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