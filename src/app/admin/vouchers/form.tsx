"use client"
import Link from "next/link";
import React, {useState} from "react";
import {generateVoucherCode} from "@/app/services/commonService";
import {IVoucher} from "@/app/interfaces/IVoucher";

export default function VoucherForm() {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [data, setData] = useState<IVoucher>({} as IVoucher)

    const autoGenareteCode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setData({...data, ["code"]: generateVoucherCode()})
        // console.log(data)
    }

    const handleInputChange  = (e: React.ChangeEvent<HTMLInputElement>) =>  {
        setData({...data, [e.target.name]: e.target.value})
        // console.log(data)
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>  {
        setData({...data, [e.target.name]: e.target.value})
        // console.log(data)
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, type: e.target.checked ? "private" : "public" });
        // console.log(data)
    };

    return (
        <div className="row">
            <div className="card">
                <div className="card-body">
                    <div className="title-header option-title">
                        <h5>Thông tin voucher</h5>
                    </div>

                    <div className="tab-content" id="pills-tabContent">
                        <div className="tab-pane fade active show" id="pills-home" role="tabpanel">
                            <form className="theme-form theme-form-2 mega-form">

                                <div className="row">
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-lg-2 col-md-3 mb-0">Tên
                                            chương trình:</label>
                                        <div className="col-md-9 col-lg-10">
                                            <input className="form-control" type="text" value={data.name} onChange={handleInputChange} name="name"
                                                   placeholder="Ví dụ: chào mừng thành viên mới, ngày hội thể thao, ..."/>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label
                                            className="col-lg-2 col-md-3 col-form-label form-label-title">Mã
                                            giảm</label>
                                        <div className={ isEditing ? "col-md-9 col-lg-10" : "col-md-7 col-lg-8"}>
                                            <input className="form-control" disabled={true} type="text" value={data.code} onChange={handleInputChange} name="code"/>
                                        </div>
                                        <div className={ isEditing ? "d-none" : "col-md-2 col-lg-2" }>
                                            <button className="btn btn-primary" onClick={autoGenareteCode}>Tự động tạo</button>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label
                                            className="col-lg-2 col-md-3 col-form-label form-label-title">Giá trị
                                            giảm</label>
                                        <div className="col-md-9 col-lg-10">
                                            <input className="form-control" type="number" value={data.value} onChange={handleInputChange} name="value" placeholder="vnđ"/>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label
                                            className="col-lg-2 col-md-3 col-form-label form-label-title">Ngày
                                            bắt đầu</label>
                                        <div className="col-md-9 col-lg-10">
                                            <input className="form-control" type="datetime-local"
                                                   value={data.issue_date} onChange={handleInputChange} name="issue_date"/>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label
                                            className="col-lg-2 col-md-3 col-form-label form-label-title">Ngày
                                            kết thúc</label>
                                        <div className="col-md-9 col-lg-10">
                                            <input className="form-control" type="datetime-local"
                                                   value={data.expired_date} onChange={handleInputChange} name="expired_date"/>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-lg-2 col-md-3 mb-0">Phát hành
                                            nội bộ ?</label>
                                        <div className="col-md-9">
                                            <div className="form-check user-checkbox ps-0">
                                                <input className="checkbox_animated check-it"
                                                       type="checkbox" checked={data.type === "private"} onChange={handleCheckboxChange} name="type" id="flexCheckDefault"/>
                                                <small className="text-danger"><i>*Chọn đồng nghĩa với việc
                                                    chỉ admin
                                                    có quyền cho người dùng nào sử dụng mã giảm
                                                    giá</i></small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label
                                            className="col-lg-2 col-md-3 col-form-label form-label-title">Số
                                            lượng</label>
                                        <div className="col-md-9 col-lg-10">
                                            <input className="form-control" value={data.quantity} onChange={handleInputChange} name="quantity" type="number"/>
                                        </div>
                                    </div>

                                    <div className="row align-items-center mb-4">
                                        <label className="form-label-title col-lg-2 col-md-3 mb-0">Trạng
                                            thái</label>
                                        <div className="col-md-9 col-lg-10">
                                            <select onChange={handleSelectChange} name="status" id="" className="form-select">
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Không hoạt động</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4 d-flex gap-2 col-sm-12 col-md-6 justify-content-center">
                                        <button type="submit" className="btn btn-solid flex-grow-1">
                                            {isEditing ? "Cập nhật" : "Lưu"}
                                        </button>
                                        <Link href="/admin/vouchers" className="btn btn-warning flex-grow-1">
                                            Trở lại
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}