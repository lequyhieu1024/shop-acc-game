"use client"
import {useEffect, useState} from "react";
import Loading from "@/components/Loading";
import api from "@/app/services/axiosService";
import {IProduct} from "@/app/interfaces/IProduct";
import ErrorPage from "@/components/(admin)/Error";
import Link from "next/link";
import {Table, Space, TableProps, Tag} from 'antd';
import {EyeOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import Image from "next/image";

export default function Product() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)

    const fetchProducts = async () => {
        try {
            const response = await api.get('products');
            if (response.status === 200) {
                setProducts(response.data.products || [])
                setError(false)
            } else {
                setError(true)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, []);

    const columns: TableProps<IProduct>['columns'] = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (thumbnail, record) => (
                <Image width={200} height={200}
                    src={thumbnail}
                    alt={record.name}
                    className="img-fluid"
                />
            ),
        },
        {
            title: 'Giá',
            key: 'price',
            render: (record) => (
                <div>
                    <del>{record.regular_price}đ</del>
                    <span> {record.sale_price}đ</span>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'success' : 'danger'}>{status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Tag>
            ),
        },
        {
            title: 'Tùy chọn',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <a href={`product-detail/${record.id}`}>
                        <EyeOutlined/>
                    </a>
                    <a href={`edit-product/${record.id}`}>
                        <EditOutlined/>
                    </a>
                    <a
                        href="javascript:void(0)"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalToggle"
                    >
                        <DeleteOutlined/>
                    </a>
                </Space>
            ),
        },
    ];

    return (
        loading ? <Loading/> : (
            error ? <ErrorPage/> : (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card card-table">
                            <div className="card-body">
                                <div className="title-header option-title">
                                    <h5>Tất Cả Sản Phẩm</h5>
                                    <form className="d-inline-flex">
                                        <Link href="/admin/products/create"
                                              className="align-items-center btn btn-theme d-flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                 viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                                dataSource={products}
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
            )
        )
    )
}