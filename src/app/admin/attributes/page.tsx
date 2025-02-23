"use client"
import React, {useEffect, useState} from "react";
import {IAttribute} from "@/app/interfaces/IAttribute";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import Link from "next/link";
import DeleteConfirm from "@/components/DeleteConfirm";
import {toast} from "react-toastify";
import {FormSearch} from "@/components/(admin)/(form)/FormSeach";

export default function AttributePage() {
    const [loading, setLoading] = useState(true);
    const [attributes, setAttribute] = useState<IAttribute[]>([])
    const [message, setMessage] = useState("")
    const fetchAttribute = async (name: string | null = null, size: number | null = null ) => {
        // setLoading(true); //có loading sẽ mất dữ liệu ở input khi lọc
        try {
            let url = "/attributes?"
            if (size) {
                url += `size=${encodeURIComponent(size)}`
            }
            if (name) {
                url += `&name=${encodeURIComponent(name)}`
            }
            const res = await api.get(url)

            if (res.status == 200) {
                setAttribute(res.data.attributes)
            }
        } catch (e) {
            console.log((e as Error).message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchAttribute();
        const msg: string | null = sessionStorage.getItem("message");
        if (msg) {
            setMessage(msg)
            sessionStorage.removeItem("message");
        }
    }, []);

    useEffect(() => {
        if (message) {
            toast.success(message)
        }
    }, [message]);

    const handleDelete = async (id: number) => {
        try {
            const res = await api.delete(`/attributes/${id}`);
            if (res) {
                setMessage("Xóa thuộc tính thành công")
                fetchAttribute();
            }
        } catch (e) {
            console.log((e as Error).message)
        }
    }

    return (
        loading ? <Loading/> :
            <div className="row">
                <div className="col-sm-12">
                    <div className="card card-table">
                        <div className="card-body">
                            <div className="title-header option-title">
                                <h5>Tất cả thuộc tính</h5>
                                <form className="d-inline-flex">
                                    <Link href="/attributes/create" className="align-items-center btn btn-theme d-flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 24 24"
                                             fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                             strokeLinejoin="round" className="feather feather-plus-square">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="12" y1="8" x2="12" y2="16"></line>
                                            <line x1="8" y1="12" x2="16" y2="12"></line>
                                        </svg>
                                        Thêm mới
                                    </Link>
                                </form>
                            </div>

                            <div className="table-responsive category-table">
                                <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                                    <FormSearch onSearch={fetchAttribute} />
                                    <table className="table all-package theme-table dataTable no-footer" id="table_id">
                                        <thead>
                                        <tr>
                                            <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                style={{width: 433.938}}>Tên thuộc tính
                                            </th>
                                            <th className="sorting_disabled" rowSpan={1} colSpan={1}
                                                style={{width: 433.953}}>Hành động
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        {
                                            attributes.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="p-5">
                                                        <h5>No data</h5>
                                                    </td>
                                                </tr>
                                            ) : (
                                                attributes.map((attribute: IAttribute) => (
                                                    <tr className="odd" key={attribute.id}>
                                                        <td>{attribute.name}</td>

                                                        <td>
                                                            <ul>
                                                                <li>
                                                                    <Link href={`/attributes/${attribute.id}`}>
                                                                        <i className="ri-pencil-line"></i>
                                                                    </Link>
                                                                </li>

                                                                <li>
                                                                    <DeleteConfirm
                                                                        onConfirm={() => handleDelete(attribute.id)}/>
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
    )

}