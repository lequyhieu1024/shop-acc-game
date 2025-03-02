"use client";
import { useState } from "react";
import { ICategory } from "@/app/interfaces/ICategory";

interface ProductFormProps {
    categories: ICategory[];
}

export default function ProductForm({ categories }: ProductFormProps) {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        thumbnail: null as File | null,
        description: "",
        regular_price: 0,
        sale_price: 0,
        skin_type: "",
        is_infinity_card: false,
        register_by: "",
        rank: "",
        server: "",
        number_diamond_available: 0,
        status: "active" as "active" | "inactive",
        is_for_sale: false,
        category_id: 0,
        images: [] as File[],
    });

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

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({
            ...prev,
            thumbnail: file,
        }));
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setFormData((prev) => ({
            ...prev,
            images: files,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

        formData.images.forEach((image, index) => {
            data.append(`images[${index}]`, image);
        });

        console.log("Dữ liệu FormData:");
        for (const [key, value] of data.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                body: data,
            });
            const result = await response.json();
            console.log("Kết quả từ API:", result);
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };

    return (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <div className="col-sm-8 m-auto">
                        {/* Một form duy nhất bao quanh tất cả */}
                        <form
                            className="theme-form theme-form-2 mega-form"
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                        >
                            {/* Thông tin sản phẩm */}
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
                                                className="form-control"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Nhập tên sản phẩm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Mã sản phẩm
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleChange}
                                                placeholder="Nhập mã sản phẩm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Loại skin súng
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="skin_type"
                                                value={formData.skin_type}
                                                onChange={handleChange}
                                                placeholder="Ví dụ: Vip, Vip Pro, Bình thường, ..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Danh mục
                                        </label>
                                        <div className="col-sm-9">
                                            <select
                                                className="form-control"
                                                name="category_id"
                                                value={formData.category_id}
                                                onChange={handleChange}
                                                required
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

                            {/* Hình ảnh */}
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
                                                className="form-control"
                                                type="file"
                                                name="thumbnail"
                                                onChange={handleThumbnailChange}
                                                accept="image/*"
                                                required
                                            />
                                            {formData.thumbnail && (
                                                <p>Đã chọn: {formData.thumbnail.name}</p>
                                            )}
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
                                            {formData.images.length > 0 && (
                                                <ul>
                                                    {formData.images.map((image, index) => (
                                                        <li key={index}>{image.name}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Giá sản phẩm */}
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
                                                className="form-control"
                                                type="number"
                                                name="regular_price"
                                                value={formData.regular_price}
                                                onChange={handleChange}
                                                min={0}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Giá bán
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="sale_price"
                                                value={formData.sale_price}
                                                onChange={handleChange}
                                                min={0}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin bổ sung */}
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-header-2">
                                        <h5>Thông tin bổ sung</h5>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Số kim cương
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="number"
                                                name="number_diamond_available"
                                                value={formData.number_diamond_available}
                                                onChange={handleChange}
                                                min={0}
                                            />
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
                                            Người đăng ký
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="register_by"
                                                value={formData.register_by}
                                                onChange={handleChange}
                                                placeholder="Nhập người đăng ký"
                                            />
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
                                            Thẻ vô hạn
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

                                    {/* Nút submit */}
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