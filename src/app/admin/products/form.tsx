"use client";
import React, {useState} from "react";
import { ICategory } from "@/app/interfaces/ICategory";
import {generateVoucherCode} from "@/app/services/commonService";
import {IProduct} from "@/app/interfaces/IProduct";
import api from "@/app/services/axiosService";
import {toast} from "react-toastify";
import Image from "next/image";

interface ProductFormProps {
    isEditing?: boolean;
    initialData?: IProduct | null;
    categories: ICategory[];
}

export default function ProductForm({ isEditing = false, categories , initialData = null}: ProductFormProps) {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        thumbnail: null as File | null,
        description: "",
        regular_price: 0,
        sale_price: 0,
        skin_type: "",
        is_infinity_card: false,
        account_id: "",
        account_name: "",
        register_by: "",
        rank: "",
        server: "",
        number_diamond_available: 0,
        status: "active" as "active" | "inactive",
        is_for_sale: true,
        category_id: 0,
        quantity: 0,
        images: [] as File[],
    });
    const [fileReading, setFileReading] = useState<string | null>(null);
    const [imagesReading, setImagesReading] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên sản phẩm không được để trống";
        }

        if (!formData.code.trim()) {
            newErrors.code = "Mã tài khoản không được để trống";
        }

        if (!formData.thumbnail && !isEditing) {
            newErrors.thumbnail = "Vui lòng chọn ảnh thumbnail";
        }

        if (!formData.skin_type.trim()) {
            newErrors.skin_type = "Loại súng không được để trống";
        }

        if (formData.sale_price >= formData.regular_price) {
            newErrors.sale_price = "Nên để giá bán thấp hơn giá gốc";
        }

        if (formData.regular_price <= 0) {
            newErrors.regular_price = "Vui lòng nhập giá gốc";
        }

        if (formData.sale_price <= 0) {
            newErrors.sale_price = "Vui lòng nhập giá bán";
        }

        if (formData.number_diamond_available < 0) {
            newErrors.number_diamond_available = "Số kim cương không được nhỏ hơn 0";
        }

        if (formData.quantity <= 0) {
            newErrors.quantity = "Số lượng phải lớn hơn 0";
        }

        if (!formData.register_by.trim()) {
            newErrors.register_by = "Bắt buộc phải nhập thông tin đăng ký";
        }

        if (formData.category_id === 0) {
            newErrors.category_id = "Vui lòng chọn danh mục";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : type === "number"
                        ? parseFloat(value) || 0
                        : value,
        }));
    };

    if (initialData) {
        console.log("editing");
    }

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            thumbnail: file,
        }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFileReading(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setFormData((prev) => ({
            ...prev,
            images: files,
        }));
        const imagesArray: string[] = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                imagesArray.push(reader.result as string);
                setImagesReading([...imagesArray]);
            };
            reader.readAsDataURL(file);
        });
    };

    const autoGenareteCode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setFormData({ ...formData, ["code"]: generateVoucherCode() });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại các trường thông tin");
            return;
        }

        const data = new FormData();
        data.append("code", formData.code);
        data.append("name", formData.name);
        if (formData.thumbnail) {
            data.append("thumbnail", formData.thumbnail);
        }
        data.append("description", formData.description);
        data.append("regular_price", formData.regular_price.toString());
        data.append("sale_price", formData.sale_price.toString());
        data.append("skin_type", formData.skin_type);
        data.append("is_infinity_card", formData.is_infinity_card.toString());
        data.append("register_by", formData.register_by);
        data.append("rank", formData.rank);
        data.append("server", formData.server);
        data.append(
            "number_diamond_available",
            formData.number_diamond_available.toString()
        );
        data.append("status", formData.status);
        data.append("is_for_sale", formData.is_for_sale.toString());
        data.append("category_id", formData.category_id.toString());
        data.append("quantity", formData.quantity.toString());
        data.append("account_id", formData.account_id.toString());
        data.append("account_name", formData.account_name.toString());

        for (const file of imagesReading) {
            data.append("images", file);
        }

        console.log("Dữ liệu FormData:");
        for (const [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }


        try {
            const response = await api.post("products", data);
            if (response.status === 200) {
                toast.success('Thêm mới thành công');
                setFormData({
                    code: "",
                    name: "",
                    thumbnail: null as File | null,
                    description: "",
                    regular_price: 0,
                    sale_price: 0,
                    skin_type: "",
                    is_infinity_card: false,
                    account_id: "",
                    account_name: "",
                    register_by: "",
                    rank: "",
                    server: "",
                    number_diamond_available: 0,
                    status: "active" as "active" | "inactive",
                    is_for_sale: true,
                    category_id: 0,
                    quantity: 0,
                    images: [] as File[],
                })
            } else {
                toast.error('Có lỗi server')
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };

    return (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <div className="m-auto">
                        <form
                            className="theme-form theme-form-2 mega-form"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>Thông tin sản phẩm</h5>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Tên sản phẩm
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Nhập tên sản phẩm"
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Mã tài khoản
                                        </label>
                                        <div className="col-sm-9 d-flex align-items-center">
                                            <input
                                                className={`form-control me-2 ${errors.code ? 'is-invalid' : ''}`}
                                                disabled={true}
                                                type="text"
                                                value={formData.code}
                                                onChange={handleChange}
                                                name="code"
                                            />
                                            {!isEditing && (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={autoGenareteCode}
                                                >
                                                    Tự động tạo
                                                </button>
                                            )}
                                            {isEditing && (
                                                <small className="text-danger ms-2">
                                                    <i>Không được cập nhật trường này</i>
                                                </small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Loại skin súng
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.skin_type ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="skin_type"
                                                value={formData.skin_type}
                                                onChange={handleChange}
                                                placeholder="Ví dụ: Vip, Vip Pro, Bình thường, ..."
                                            />
                                            {errors.skin_type &&
                                                <div className="invalid-feedback">{errors.skin_type}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Số lượng tài khoản
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                placeholder="Ví dụ: Vip, Vip Pro, Bình thường, ..."
                                            />
                                            {errors.quantity &&
                                                <div className="invalid-feedback">{errors.quantity}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Trạng thái
                                        </label>
                                        <div className="col-sm-9">
                                            <select
                                                className="form-control"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                            >
                                                <option value="active">Hoạt động</option>
                                                <option value="inactive">Không hoạt động</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Có bán
                                        </label>
                                        <div className="col-sm-9">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    name="is_for_sale"
                                                    checked={formData.is_for_sale}
                                                    onChange={handleChange}
                                                />
                                                <span className="switch-state"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Danh mục
                                        </label>
                                        <div className="col-sm-9">
                                            <select
                                                className={`form-control ${errors.category_id ? 'is-invalid' : ''}`}
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                            >
                                                {categories.length === 0 ? (
                                                    <option value="" disabled>
                                                        Chưa có danh mục
                                                    </option>
                                                ) : (
                                                    <>
                                                        <option value={0} disabled>
                                                            Chọn danh mục
                                                        </option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </>
                                                )}
                                            </select>
                                            {errors.category_id &&
                                                <div className="invalid-feedback">{errors.category_id}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>Mô tả sản phẩm</h5>
                                    </div>
                                    <div className="row">
                                        <label className="form-label-title col-sm-3 mb-0">Mô tả</label>
                                        <div className="col-sm-9">
                                          <textarea
                                              className="form-control"
                                              name="description"
                                              value={formData.description}
                                              onChange={handleChange}
                                              rows={5}
                                              placeholder="Nhập mô tả sản phẩm"
                                          />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>Hình ảnh sản phẩm</h5>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Ảnh thumbnail
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.thumbnail ? 'is-invalid' : ''}`}
                                                type="file"
                                                name="thumbnail"
                                                onChange={handleThumbnailChange}
                                                accept="image/*"
                                            />
                                            {fileReading && (
                                                <div className="mt-2">
                                                    <Image
                                                        height={120}
                                                        width={180}
                                                        src={fileReading}
                                                        alt="Danh mục"
                                                    />
                                                </div>
                                            )}
                                            {errors.thumbnail && <div className="invalid-feedback">{errors.thumbnail}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Ảnh bổ sung
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="file"
                                                name="images"
                                                onChange={handleImagesChange}
                                                accept="image/*"
                                                multiple
                                            />
                                            {imagesReading && (
                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                    {imagesReading.map((imageReading: string, index: number) => (
                                                        <div key={index}>
                                                            <Image
                                                                height={100}
                                                                width={100}
                                                                src={imageReading}
                                                                alt="Danh mục"
                                                                style={{ objectFit: "cover", borderRadius: "8px" }}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>Giá sản phẩm</h5>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                    <label className="form-label-title col-sm-3 mb-0">
                                            Giá gốc
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.regular_price ? 'is-invalid' : ''}`}
                                                type="number"
                                                name="regular_price"
                                                value={formData.regular_price}
                                                onChange={handleChange}
                                                min={0}
                                            />
                                            {errors.regular_price && <div className="invalid-feedback">{errors.regular_price}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Giá bán
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.sale_price ? 'is-invalid' : ''}`}
                                                type="number"
                                                name="sale_price"
                                                value={formData.sale_price}
                                                onChange={handleChange}
                                                min={0}
                                            />
                                            {errors.sale_price && <div className="invalid-feedback">{errors.sale_price}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>Thông tin bổ sung</h5>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            ID Tài Khoản
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.account_id ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="account_id"
                                                value={formData.account_id}
                                                onChange={handleChange}
                                                min={0}
                                            />
                                            {errors.account_id &&
                                                <div className="invalid-feedback">{errors.account_id}</div>}
                                        </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Tên người chơi
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.account_name ? 'is-invalid' : ''}`}
                                                type="text"
                                                name="account_name"
                                                value={formData.account_name}
                                                onChange={handleChange}
                                                min={0}
                                            />
                                            {errors.account_name &&
                                                <div className="invalid-feedback">{errors.account_name}</div>}
                                        </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Số kim cương
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.number_diamond_availale ? 'is-invalid' : ''}`}
                                                type="number"
                                                name="number_diamond_available"
                                                value={formData.number_diamond_available}
                                                onChange={handleChange}
                                                min={0}
                                            />
                                            {errors.number_diamond_available && <div
                                                className="invalid-feedback">{errors.number_diamond_available}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">Rank</label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="rank"
                                                value={formData.rank}
                                                onChange={handleChange}
                                                placeholder="Nhập rank"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Server
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="server"
                                                value={formData.server}
                                                onChange={handleChange}
                                                placeholder="Nhập server"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Đăng ký bằng:
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.register_by ? 'is-invalid' : ""}`}
                                                type="text"
                                                name="register_by"
                                                value={formData.register_by}
                                                onChange={handleChange}
                                                placeholder="Garena, Facebook, Google, ..."
                                            />
                                            {errors.register_by &&
                                                <div className="invalid-feedback">{errors.register_by}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Thẻ vô cực
                                        </label>
                                        <div className="col-sm-9">
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    name="is_infinity_card"
                                                    checked={formData.is_infinity_card}
                                                    onChange={handleChange}
                                                />
                                                <span className="switch-state"></span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-9 offset-sm-3">
                                            <button type="submit" className="btn btn-primary">
                                                Lưu sản phẩm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}