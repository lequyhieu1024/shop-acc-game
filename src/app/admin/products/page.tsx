"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import api from "@/app/services/axiosService";
import { IProduct } from "@/app/interfaces/IProduct";
import ErrorPage from "@/components/(admin)/Error";
import Link from "next/link";
import { Table, Space, TableProps, Tag, Input, Select, Button, Form } from "antd";
import Image from "next/image";
import DeleteConfirm from "@/components/DeleteConfirm";
import { toast } from "react-toastify";

const { Option } = Select;

export default function Product() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        name: "",
        categoryId: "",
        status: "" as "" | "active" | "inactive",
        minPrice: "",
        maxPrice: "",
        isForSale: "" as "" | "0" | "1",
        code: "",
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchProducts = async (page: number = pagination.current, pageSize: number = pagination.pageSize) => {
        try {
            setLoading(true);
            const query = new URLSearchParams({
                ...(filters.name && { name: filters.name }),
                ...(filters.categoryId && { category_id: filters.categoryId }),
                ...(filters.status && { status: filters.status }),
                ...(filters.minPrice && { min_price: filters.minPrice }),
                ...(filters.maxPrice && { max_price: filters.maxPrice }),
                ...(filters.isForSale && { is_for_sale: filters.isForSale }),
                ...(filters.code && { code: filters.code }),
                page: page.toString(),
                limit: pageSize.toString(),
            }).toString();

            const response = await api.get(`products?${query}`);
            if (response.status === 200) {
                setProducts(response.data.products || []);
                setPagination({
                    ...pagination,
                    current: page,
                    pageSize: pageSize,
                    total: response.data.pagination.total,
                });
                setError(false);
            } else {
                setError(true);
            }
        } catch (e) {
            console.log(e);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: number) => {
        try {
            const res = await api.delete(`products/${id}`);
            if (res) {
                toast.success("Xóa sản phẩm thành công");
                await fetchProducts();
            }
        } catch (e) {
            setError(true);
            console.log((e as Error).message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleFilterSubmit = () => {
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchProducts(1);
    };

    const handleResetFilters = () => {
        setFilters({
            name: "",
            categoryId: "",
            status: "" as "" | "active" | "inactive",
            minPrice: "",
            maxPrice: "",
            isForSale: "" as "" | "0" | "1",
            code: "",
        });
        setPagination((prev) => ({ ...prev, current: 1 }));
        fetchProducts(1);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTableChange = (pagination: any) => {
        const { current, pageSize } = pagination;
        fetchProducts(current, pageSize);
    };

    const columns: TableProps<IProduct>["columns"] = [
        {
            title: "Mã",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng còn",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Ảnh",
            dataIndex: "thumbnail",
            key: "thumbnail",
            render: (thumbnail, record) => (
                <Image
                    width={100}
                    height={100}
                    src={thumbnail}
                    alt={record.name}
                    className="img-fluid"
                />
            ),
        },
        {
            title: "Giá",
            key: "price",
            render: (record) => (
                <div className={`d-flex flex-column`}>
                    <del className={`text-danger`}>{record.regular_price.toLocaleString("vi-VN")} đ</del>
                    <span>{record.sale_price.toLocaleString("vi-VN")} đ</span>
                </div>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "green" : "red"}>
                    {status === "active" ? "Hoạt động" : "Không hoạt động"}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (product) => (
                <Space size="middle">
                    <Link href={`/admin/products/${product.id}`}>
                        <i className="ri-pencil-line"></i>
                    </Link>
                    <DeleteConfirm onConfirm={() => onDelete(product.id)} />
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
                        <div className="title-header option-title d-flex justify-content-between align-items-center">
                            <h5>Tất Cả Sản Phẩm</h5>
                            <Link href="/admin/products/create" className="align-items-center btn btn-theme d-flex">
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
                        </div>

                        {/* Form lọc */}
                        <Form layout="inline" className="mb-4" onFinish={handleFilterSubmit}>
                            <Form.Item label="Mã sản phẩm">
                                <Input
                                    value={filters.code}
                                    onChange={(e) => handleFilterChange("code", e.target.value)}
                                    placeholder="Nhập mã sản phẩm"
                                />
                            </Form.Item>
                            <Form.Item label="Tên sản phẩm">
                                <Input
                                    value={filters.name}
                                    onChange={(e) => handleFilterChange("name", e.target.value)}
                                    placeholder="Nhập tên sản phẩm"
                                />
                            </Form.Item>
                            <Form.Item label="Danh mục">
                                <Input
                                    type="number"
                                    value={filters.categoryId}
                                    onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                                    placeholder="Nhập ID danh mục"
                                />
                            </Form.Item>
                            <Form.Item label="Trạng thái">
                                <Select
                                    value={filters.status}
                                    onChange={(value) => handleFilterChange("status", value)}
                                    style={{ width: 120 }}
                                >
                                    <Option value="">Tất cả</Option>
                                    <Option value="active">Hoạt động</Option>
                                    <Option value="inactive">Không hoạt động</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Giá từ">
                                <Input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                                    placeholder="Min"
                                />
                            </Form.Item>
                            <Form.Item label="Đến">
                                <Input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                                    placeholder="Max"
                                />
                            </Form.Item>
                            <Form.Item label="Có sẵn để bán">
                                <Select
                                    value={filters.isForSale}
                                    onChange={(value) => handleFilterChange("isForSale", value)}
                                    style={{ width: 120 }}
                                >
                                    <Option value="">Tất cả</Option>
                                    <Option value="1">Có</Option>
                                    <Option value="0">Không</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Lọc
                                </Button>
                                <Button className="ml-2" onClick={handleResetFilters}>
                                    Reset
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="table-responsive product-table">
                            <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                                <Table
                                    columns={columns}
                                    dataSource={products}
                                    rowKey="id"
                                    className="theme-table"
                                    bordered
                                    pagination={{
                                        current: pagination.current,
                                        pageSize: pagination.pageSize,
                                        total: pagination.total,
                                        showSizeChanger: true,
                                        pageSizeOptions: ["10", "20", "50", "100"],
                                        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}