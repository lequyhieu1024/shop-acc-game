"use client";
import React, {useState, useEffect} from "react";
import api from "@/app/services/axiosService";
import {useRouter} from "next/navigation";
import {ICategory} from "@/app/interfaces/ICategory";
import Loading from "@/components/Loading";
import Link from "next/link";
import {toast} from "react-toastify";

interface CategoryEditProps {
    isEditing?: boolean,
    initialData?: ICategory | null
}

export default function CategoryForm({initialData = null, isEditing = false}: CategoryEditProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({name: ""});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [fileReading, setFileReading] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (initialData) {
            setFormData({name: initialData.name});
            if (initialData.image) {
                setFileReading(initialData.image);
            }
        }
        setLoading(false);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);

        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileReading(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (isEditing) {
            if (!formData.name) {
                toast.error("Vui lòng nhập đầy đủ tên.");
                setLoading(false)
                return;
            }
        } else {
            if (!formData.name || !selectedFile) {
                toast.error("Vui lòng nhập đầy đủ tên và ảnh.");
                setLoading(false)
                return;
            }
        }

        const data = new FormData();
        data.append("name", formData.name);
        if (selectedFile) data.append("image", selectedFile);

        try {
            let response;
            if (isEditing && initialData) {
                response = await api.patch(`categories/${initialData.id}`, data);
            } else {
                response = await api.post("categories", data);
            }

            if (response.status === 200) {
                sessionStorage.setItem("message", `Danh mục đã ${isEditing ? "cập nhật" : "tạo"} thành công!`);
                router.push("/admin/categories");
            } else {
                setMessage("Có lỗi xảy ra, thử lại.");
            }
        } catch {
            setMessage("Lỗi khi gửi dữ liệu.");
        } finally {
            setLoading(false)
        }
    };

    return (
        loading ? <Loading/> : (
            <div className="row">
                <div className="col-12">
                    <div className="row">
                        <div className="col-sm-8 m-auto">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>{isEditing ? "Chỉnh sửa danh mục" : "Thông tin danh mục"}</h5>
                                    </div>

                                    <form onSubmit={handleSubmit} className="theme-form theme-form-2 mega-form">
                                        <div className="mb-4 row align-items-center">
                                            <label className="form-label-title col-sm-3 mb-0">Tên danh mục</label>
                                            <div className="col-sm-9">
                                                <input className="form-control" type="text" name="name"
                                                       value={formData.name} placeholder="Tên danh mục"
                                                       onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className="mb-4 row align-items-center">
                                            <label className="col-sm-3 col-form-label form-label-title">Ảnh danh
                                                mục</label>
                                            <div className="col-sm-9">
                                                <input className="form-control form-choose" name="image" type="file"
                                                       onChange={handleFileChange}/>
                                                <div>
                                                    {message && <p className="mt-3 text-danger">{message}</p>}
                                                </div>
                                                {fileReading && (
                                                    <div className="mt-2">
                                                        <img src={fileReading} alt="Danh mục"
                                                             style={{maxWidth: "200px", maxHeight: "150px"}}/>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4 d-flex gap-2 col-sm-12 col-md-6 justify-content-center">
                                            <button type="submit" className="btn btn-solid flex-grow-1">
                                                {isEditing ? "Cập nhật" : "Lưu"}
                                            </button>
                                            <Link href="/admin/categories" className="btn btn-warning flex-grow-1">
                                                Trở lại
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
