"use client"
import React, {useEffect, useState} from "react";
import {ISystem} from "@/app/interfaces/ISystem";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";

export default function System() {

    const [loading, setLoading] = useState<boolean>(true)
    const [system, setSystem] = useState<ISystem | null>(null)
    const [error, setError] = useState<boolean>(false)
    const [fileReading, setFileReading] = useState<string | null>("/admin/assets/images/placeholder.png");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    const fetchData = async () => {
        try {
            const response = await api.get("/systems")
            if (response.status == 200 && response.data.system) {
                setSystem(response.data.system)
                setError(false)
            } else {
                console.log(response)
                setError(true)
            }
        } catch (e) {
            console.log((e as Error).message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    return (
        loading ? <Loading/> : (
            error ? (
                <ErrorPage/>
            ) : (
                system ? (
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="title-header option-title">
                                                <h5>Cài đặt hệ thống</h5>
                                            </div>
                                            <form className="theme-form theme-form-2 mega-form">
                                                <div className="row">
                                                    <div className="row mb-md-4">
                                                        <div className="col-sm-12 col-md-6 mb-sm-4 mb-md-0">
                                                            <label
                                                                className="col-form-label form-label-title">Logo
                                                                website(tệp .png, .jpg, .jpeg, ...)</label>
                                                            <div className="col-sm-12">
                                                                <input className="form-control form-choose" onChange={handleFileChange}
                                                                       type="file"/>
                                                            </div>
                                                            {fileReading && (
                                                                <div className="mt-4 mb-5">
                                                                    <img src={fileReading} alt="Danh mục"
                                                                         style={{maxWidth: "300px", maxHeight: "250px"}}/>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="col-sm-12 col-md-6 mb-sm-4 mb-md-0">
                                                            <label
                                                                className="col-form-label form-label-title">Icon
                                                                website(tệp .ico)</label>
                                                            <div className="col-sm-12">
                                                                <input className="form-control form-choose"
                                                                       type="file"/>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Tên
                                                            website</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="text"
                                                                   value={system.name ?? ""}/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Số điện
                                                            thoại</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="number"
                                                                   value={system.phone ?? ""}/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Email</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="email"
                                                                   value={system.email ?? ""}
                                                                   placeholder="Enter Your Email Address"/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Link
                                                            Youtube</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="text"
                                                                   value={system.youtube ?? ""}
                                                                   placeholder="Nhập link"/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Link
                                                            Fan page</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="text"
                                                                   value={system.facebook ?? ""}
                                                                   placeholder="Nhập link"/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Link
                                                            Tiktok</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="text"
                                                                   value={system.tiktok ?? ""}
                                                                   placeholder="Nhập link"/>
                                                        </div>
                                                    </div>

                                                </div>
                                                <button className={`mt-3 btn btn-primary`}>Lưu thay đổi</button>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="card">
                                        <div className="card-body">
                                            <div className="title-header option-title">
                                                <h5>Cập nhập mật khẩu</h5>
                                            </div>
                                            <form className="theme-form theme-form-2 mega-form">
                                                <div className="row">
                                                    <div className="mb-4 row align-items-center">
                                                        <label
                                                            className="form-label-title col-sm-2 mb-0">Mật khẩu
                                                            cũ</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="password" placeholder="Enter Your Old Password"/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label
                                                            className="form-label-title col-sm-2 mb-0">Mật khẩu
                                                            mới</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="password" placeholder="Enter Your New Password"/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4 row align-items-center">
                                                        <label className="form-label-title col-sm-2 mb-0">Xác nhận mật
                                                            khẩu</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" type="password"
                                                                   placeholder="Enter Your Confirm Password"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className={`mt-3 btn btn-info`}>Cập nhật</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h2>Dữ liệu đã bị mất</h2>
                )
            )
        )
    )
}