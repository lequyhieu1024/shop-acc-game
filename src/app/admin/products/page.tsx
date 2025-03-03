"use client"
import {useEffect, useState} from "react";
import Loading from "@/components/Loading";
import api from "@/app/services/axiosService";
import {IProduct} from "@/app/interfaces/IProduct";
import ErrorPage from "@/components/(admin)/Error";
import Link from "next/link";

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
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, []);

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
                                            <div id="table_id_filter" className="dataTables_filter">
                                                <label>Tìm kiếm:
                                                    <input type="search" className="" placeholder=""
                                                           aria-controls="table_id"/>
                                                </label>
                                            </div>
                                            <table className="table all-package theme-table dataTable no-footer"
                                                   id="table_id">
                                                <thead>
                                                <tr>
                                                    <th>Tên</th>
                                                    <th>Mã</th>
                                                    <th>Ảnh</th>
                                                    <th>Giá</th>
                                                    <th>Trạng thái</th>
                                                    <th>Tùy chọn</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id}>
                                                        <td>{product.name}</td>
                                                        <td>{product.code}</td>
                                                        <td>
                                                            <div className="table-image">
                                                                <img src={product.thumbnail}
                                                                     className="img-fluid"
                                                                     alt={product.name}
                                                                     style={{maxWidth: '50px'}}/>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <del>{product.regular_price}đ</del>
                                                                <span> {product.sale_price}đ</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                                <span className={`badge ${
                                                                    product.status === 'active'
                                                                        ? 'badge-success'
                                                                        : 'badge-danger'
                                                                }`}>
                                                                    {product.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                                                                </span>
                                                        </td>
                                                        <td>
                                                            <ul>
                                                                <li>
                                                                    <a href={`product-detail/${product.id}`}>
                                                                        <i className="ri-eye-line"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href={`edit-product/${product.id}`}>
                                                                        <i className="ri-pencil-line"></i>
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a href="javascript:void(0)"
                                                                       data-bs-toggle="modal"
                                                                       data-bs-target="#exampleModalToggle">
                                                                        <i className="ri-delete-bin-line"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                ))}
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