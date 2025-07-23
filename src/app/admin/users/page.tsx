"use client";
import React, { useEffect, useState } from "react";
import { IUser } from "@/app/interfaces/IUser";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import { Space, Table, TableProps, Tag, Modal, Form, InputNumber } from "antd";
import DeleteConfirm from "@/components/DeleteConfirm";
import { toast } from "react-toastify";
import { convertToInt } from "@/app/helpers/common";
import Link from "next/link";

interface Filters {
    [key: string]: string | number | boolean;
}

export default function UsersPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [users, setUsers] = useState<IUser[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [form] = Form.useForm();

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const [formData, setFormData] = useState({
        username: "",
        user_code: "",
        user_id: "",
        phone: "",
    });

    const fetchUsers = async (
        filters: Filters = formData,
        page: number = pagination.current,
        size: number = pagination.pageSize
    ) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value.toString());
            });

            const response = await api.get(`users?${params.toString()}`);

            if (response.status === 200) {
                setUsers(response.data.users || []);
                setPagination({
                    current: page,
                    pageSize: size,
                    total: response.data.pagination.total,
                });
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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleDelete = async (id: number): Promise<void> => {
        try {
            const res = await api.delete(`users/${id}`);
            if (res) {
                toast.success("Xóa người dùng thành công !");
                await fetchUsers();
            }
        } catch (e) {
            console.log((e as Error).message);
        }
    };

    const handleUpdateBalance = async (values: { balance: number }) => {
        if (selectedUserId === null) return;

        try {
            const response = await api.patch(`users/${selectedUserId}`, {
                balance: values.balance,
            });
            if (response.status === 200) {
                toast.success("Cập nhật số dư thành công!");
                setIsModalVisible(false);
                form.resetFields();
                await fetchUsers();
            }
        } catch (e) {
            console.error(e);
            toast.error("Cập nhật số dư thất bại!");
        }
    };

    const showEditModal = (user: IUser) => {
        setSelectedUserId(user.id);
        form.setFieldsValue({ balance: user.balance });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedUserId(null);
        form.resetFields();
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchUsers(formData, 1);
    };

    const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFormData({
            username: "",
            user_code: "",
            user_id: "",
            phone: "",
        });
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchUsers({
            username: "",
            user_code: "",
            user_id: "",
            phone: "",
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        fetchUsers(formData, current, pageSize);
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: TableProps<IUser>["columns"] = [
        {
            title: "User ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "username",
            dataIndex: "username",
            key: "username",
        },
        {
            title: "Mã người dùng",
            dataIndex: "user_code",
            key: "user_code",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => phone || "-",
        },
        {
            title: "Số dư",
            dataIndex: "balance",
            key: "balance",
            render: (balance: bigint) => `${convertToInt(balance)} VND`,
        },
        {
            title: "Mã giới thiệu",
            dataIndex: "referral_code",
            key: "referral_code",
            render: (referral_code: string) => referral_code == 'undefined' ? "-" : referral_code,
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (role: string) => {
                const roleMap: Record<string, { label: string; color: string }> = {
                    user: { label: "Người dùng", color: "blue" },
                    admin: { label: "Quản trị viên", color: "green" },
                };
                const { label, color } = roleMap[role] || {
                    label: "Không xác định",
                    color: "gray",
                };
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: "Ngày đăng ký",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at: Date) => new Date(created_at).toLocaleString(),
        },
        {
            title: "Hành động",
            key: "action",
            render: (user: IUser) => (
                <Space size="middle">
                    <Link href={`#`} onClick={() => showEditModal(user)}>
                        <i className="ri-pencil-line"></i>
                    </Link>
                    <Link href={`/admin/transactions?user_code=${user.user_code}`}>
                        <i className="ri-history-line"></i>
                    </Link>
                    {user.role !== "admin" ? (
                        <>
                            <DeleteConfirm onConfirm={() => handleDelete(user.id)} />
                        </>
                    ) : null}
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
                            <h5>Tất cả người dùng</h5>
                        </div>
                        <div>
                            <div className="table-responsive">
                                <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                                    <div>
                                        <form onSubmit={handleSearch} className="mb-3">
                                            <div className="row g-3">
                                                <div className="col-md-3">
                                                    <input
                                                        type="text"
                                                        name="user_id"
                                                        className="form-control"
                                                        placeholder="user id"
                                                        value={formData.user_id}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="user name"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <input
                                                        type="text"
                                                        name="user_code"
                                                        className="form-control"
                                                        placeholder="usercode"
                                                        value={formData.user_code}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div className="col-md-3">
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        className="form-control"
                                                        placeholder="Số điện thoại"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-3 d-flex gap-2">
                                                <button type="submit" className="btn btn-primary btn-lg">
                                                    <i className="fa fa-search"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-info btn-lg"
                                                    onClick={handleReset}
                                                >
                                                    <i className="fa fa-history"></i>
                                                </button>
                                            </div>
                                        </form>

                                        <Table
                                            columns={columns}
                                            className="theme-table"
                                            bordered
                                            dataSource={users.map((user) => ({
                                                ...user,
                                                key: user.id,
                                            }))}
                                            locale={{ emptyText: "Không có dữ liệu" }}
                                            pagination={{
                                                current: pagination.current,
                                                pageSize: pagination.pageSize,
                                                total: pagination.total,
                                                showSizeChanger: true,
                                                pageSizeOptions: ["10", "20", "50", "100"],
                                                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                                            }}
                                        />

                                        <Modal
                                            title="Cập nhật số dư"
                                            open={isModalVisible}
                                            onCancel={handleCancel}
                                            footer={null}
                                        >
                                            <Form
                                                form={form}
                                                onFinish={handleUpdateBalance}
                                                layout="vertical"
                                            >
                                                <Form.Item
                                                    name="balance"
                                                    label="Số dư (VND)"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập số dư!",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        style={{ width: "100%" }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as unknown as number}
                                                    />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Space>
                                                        <button type="submit" className="btn btn-primary">
                                                            Lưu
                                                        </button>
                                                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                                            Hủy
                                                        </button>
                                                    </Space>
                                                </Form.Item>
                                            </Form>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}