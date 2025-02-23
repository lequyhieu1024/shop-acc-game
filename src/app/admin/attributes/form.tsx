"use client"
import React, {useEffect, useState} from "react";
import {IAttribute} from "@/app/interfaces/IAttribute";
import Loading from "@/components/Loading";
import api from "@/app/services/axiosService";
import {useRouter} from "next/navigation";


interface AttributeEditProps {
    isEditing?: boolean,
    initialData?: IAttribute | null
}

export default function AttributeForm({initialData = null, isEditing = false}: AttributeEditProps) {
    const router = useRouter();
    const [data, setData] = useState({name: ""})
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    
    useEffect(() => {
        if (initialData && initialData.name) {
            setData({name: initialData.name})
        }
        setLoading(false)
    }, [initialData]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        if (!data.name.trim()) {
            setMessage("Không được để trống tên thuộc tính")
            setLoading(false)
        }
        try {
            let response;
            if (isEditing && initialData) {
                response = await api.patch(`/attributes/${initialData.id}`, data)
            } else {
                response = await api.post("/attributes",data)
            }
            if (response.status === 200) {
                router.push("/attributes")
                sessionStorage.setItem("message", `${isEditing ? 'Cập nhật' :'Tạo mới'} thuộc tính thành công!`)
            }
        } catch (e) {
            console.log((e as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        loading ? <Loading/> :
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-sm-8 m-auto">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>{isEditing ? "Cập nhật thuộc tính" : "Thông tin thuộc tính"}</h5>
                                    </div>

                                    <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                                        <div className="mb-4 row align-items-center">
                                            <label className="form-label-title col-sm-3 mb-0">Tên thuộc tính</label>
                                            <div className="col-sm-9">
                                                <small className="text-danger"><i>Nếu có nhiều thuộc tính ngăn cách với
                                                    nhau bằng dấu |</i></small>
                                                <input className="form-control" type="text" name="name"
                                                       onChange={handleChangeInput} value={data.name}
                                                       placeholder="Ví dụ: Màu sắc|Kích cỡ"
                                                />
                                                {
                                                    message && <span className="text-danger">{ message }</span>
                                                }
                                            </div>
                                        </div>

                                        <div className="mb-4 align-items-center">
                                            <button type="submit" className="btn btn-solid w-auto">
                                                {isEditing ? "Cập nhật" : "Thêm thuộc tính"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}