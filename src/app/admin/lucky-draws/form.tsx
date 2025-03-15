"use client";
import Loading from "@/components/Loading";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import { ILuckyDraw } from "@/app/interfaces/ILuckyDraw";
import { Switch } from "antd";

interface VoucherItem {
    id: number;
    name: string;
}

interface AccGameItem {
    id: number;
    name: string;
}

// interface CombineItem {
//     id: number;
//     item_type: string;
//     name?: string;
//     username?: string;
//     [key: string]: any;
// }

interface LuckyDrawProps {
    isEditing?: boolean;
    initialData?: ILuckyDraw | null;
}

export default function LuckyDrawForm({ isEditing = false, initialData = null }: LuckyDrawProps) {
    const [loading, setLoading] = useState<boolean>(true);
    // const [message, setMessage] = useState<string>("");
    const [formData, setFormData] = useState<ILuckyDraw>({
        id: 0,
        name: "",
        type: "",
        amount_draw: 0,
        quality: "",
        accept_draw: false,
        issue_date: "",
        expired_date: "",
        is_no_expired: false,
        created_at: "",
        updated_at: "",
        deleted_at: null,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [voucherOptions, setVoucherOptions] = useState<VoucherItem[]>([]);
    const [accGameOptions, setAccGameOptions] = useState<AccGameItem[]>([]);
    // const [combineOptions, setCombineOptions] = useState<CombineItem[][]>([]);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                ...initialData,
                accept_draw: initialData.accept_draw === "1" || initialData.accept_draw === true,
                issue_date:
                    initialData.issue_date instanceof Date
                        ? initialData.issue_date.toISOString().split("T")[0]
                        : initialData.issue_date,
                expired_date:
                    initialData.expired_date instanceof Date
                        ? initialData.expired_date.toISOString().split("T")[0]
                        : initialData.expired_date,
            });
            fetchAdditionalData(initialData.type);
        } else {
            setLoading(false);
        }
    }, [isEditing, initialData]);

    const fetchAdditionalData = async (type: string) => {
        setLoading(true);
        try {
            switch (type) {
                case "voucher": {
                    const voucherResp = await api.get("vouchers/get-list");
                    setVoucherOptions(voucherResp.data.vouchers || []);
                    break;
                }
                case "acc_game": {
                    const accGameResp = await api.get("products/get-list");
                    setAccGameOptions(accGameResp.data.products || []);
                    break;
                }
                // case "combine": {
                //     const accGameResp = await api.get("products/get-list");
                //     const voucherResp = await api.get("vouchers/get-list");
                //     const accGameData = Array.isArray(accGameResp.data.products) ? accGameResp.data.products : [];
                //     const voucherData = Array.isArray(voucherResp.data.vouchers) ? voucherResp.data.vouchers : [];
                //
                //     const combineResp: CombineItem[][] = [
                //         voucherData.map((item: any) => ({ ...item, item_type: "voucher" })),
                //         accGameData.map((item: any) => ({ ...item, item_type: "product" })),
                //     ];
                //
                //     setCombineOptions(combineResp || []);
                //     break;
                // }
                default:
                    break;
            }
        } catch (error) {
            console.error("Error fetching additional data:", error);
            toast.error("Đã có lỗi khi tải dữ liệu bổ sung");
        } finally {
            setLoading(false);
        }
    };

    const validate = (): { [key: string]: string } => {
        const newErrors: { [key: string]: string } = {};

        // Validate tên vòng quay
        if (!formData.name.trim()) {
            newErrors.name = "Tên vòng quay là bắt buộc.";
        }

        // Validate giá
        if (!formData.amount_draw || formData.amount_draw <= 0) {
            newErrors.amount_draw = "Giá phải là một số dương.";
        }

        // Validate chất lượng
        if (!formData.quality.trim()) {
            newErrors.quality = "Chất lượng vòng quay là bắt buộc.";
        }

        // Validate ngày phát hành và ngày hết hạn (nếu không chọn "Không hết hạn")
        if (!formData.is_no_expired) {
            if (!formData.issue_date) {
                newErrors.issue_date = "Ngày phát hành là bắt buộc.";
            }
            if (!formData.expired_date) {
                newErrors.expired_date = "Ngày hết hạn là bắt buộc.";
            }
            // if (formData.issue_date && formData.expired_date) {
            //     const issueDate = new Date(formData.issue_date);
            //     const expiredDate = new Date(formData.expired_date);
            //     if (issueDate >= expiredDate) {
            //         newErrors.expired_date = "Ngày hết hạn phải lớn hơn ngày phát hành.";
            //     }
            // }
        }

        // Validate loại
        if (!formData.type) {
            newErrors.type = "Vui lòng chọn loại vòng quay.";
        }

        // Validate items (nếu loại là voucher, acc_game, hoặc combine)
        if (["voucher", "acc_game", "combine"].includes(formData.type) && selectedItemIds.length === 0) {
            newErrors.selectedItemIds = "Vui lòng chọn ít nhất một mục.";
        }

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | boolean) => {
        if (typeof e === "boolean") {
            setFormData((prev) => {
                const updatedData = {
                    ...prev,
                    is_no_expired: e,
                };
                if (e) {
                    updatedData.issue_date = "";
                    updatedData.expired_date = "";
                }
                return updatedData;
            });
        } else {
            const { name, value, type } = e.target;
            const checked = (e.target as HTMLInputElement).checked;

            setFormData((prev) => {
                const updatedData = {
                    ...prev,
                    [name]:
                        type === "checkbox"
                            ? checked
                            : name === "amount_draw"
                                ? Number(value)
                                : value,
                };

                if (name === "type" && ["voucher", "acc_game", "combine"].includes(value)) {
                    setSelectedItemIds([]);
                    fetchAdditionalData(value);
                }

                if (name === "is_no_expired" && checked) {
                    updatedData.issue_date = "";
                    updatedData.expired_date = "";
                }

                return updatedData;
            });
        }
    };

    const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
        setSelectedItemIds(selectedOptions);

        // Thực hiện validate thời gian thực
        const validationErrors = validate();
        setErrors(validationErrors);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kiểm tra validation
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Vui lòng sửa các lỗi trước khi gửi.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                accept_draw: formData.accept_draw ? 1 : 0,
                item_ids: selectedItemIds,
            };

            if (isEditing) {
                const response = await api.put(`/lucky-draws/${formData.id}`, payload);
                if (response.status === 200) {
                    toast.success("Cập nhật vòng quay may mắn thành công");
                }
            } else {
                const response = await api.post("/lucky-draws", payload);
                if (response.status === 201) {
                    toast.success("Tạo vòng quay may mắn thành công");
                }
            }
            window.location.href = "/admin/lucky-draws";
        } catch (error) {
            // setMessage("Đã có lỗi xảy ra khi lưu dữ liệu");
            console.error("Error saving lucky draw:", error);
            toast.error("Đã có lỗi xảy ra khi lưu dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    return loading ? (
        <Loading />
    ) : (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <div className="col-sm-8 m-auto">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-header-2">
                                    <h5>{isEditing ? "Chỉnh sửa vòng quay may mắn" : "Tạo vòng quay may mắn"}</h5>
                                </div>

                                <form onSubmit={handleSubmit} className="theme-form theme-form-2 mega-form">
                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">Tên vòng quay</label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                placeholder="Tên vòng quay"
                                                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                                            />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">Giá (VNĐ)</label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.amount_draw ? "is-invalid" : ""}`}
                                                type="number"
                                                name="amount_draw"
                                                value={formData.amount_draw}
                                                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                                                min="0"
                                            />
                                            {errors.amount_draw && (
                                                <div className="invalid-feedback">{errors.amount_draw}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">
                                            Chất lượng vòng quay
                                        </label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.quality ? "is-invalid" : ""}`}
                                                type="text"
                                                name="quality"
                                                value={formData.quality}
                                                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                                                placeholder="Ví dụ: Sịn, Vip, Siêu chất, Siêu vip, ..."
                                            />
                                            {errors.quality && (
                                                <div className="invalid-feedback">{errors.quality}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">Tùy chọn</label>
                                        <div className="col-sm-9">
                                            <input
                                                type="checkbox"
                                                name="accept_draw"
                                                checked={!!formData.accept_draw}
                                                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                                            />
                                            <small className={`mx-1`}>
                                                <i>
                                                    Khi chọn nút này, người dùng mới đăng ký được tặng lượt quay may
                                                    mắn sẽ có thể quay vòng quay này
                                                </i>
                                            </small>
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">Không hết hạn</label>
                                        <div className="col-sm-9">
                                            <Switch
                                                checked={formData.is_no_expired}
                                                onChange={(checked) => handleChange(checked)}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        className="mb-4 row align-items-center"
                                        style={{ display: formData.is_no_expired ? "none" : "flex" }}
                                    >
                                        <label className="form-label-title col-sm-3 mb-0">Ngày phát hành</label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.issue_date ? "is-invalid" : ""}`}
                                                type="datetime-local"
                                                name="issue_date"
                                                value={
                                                    typeof formData.issue_date === "string"
                                                        ? formData.issue_date.split("T")[0]
                                                        : ""
                                                }
                                                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                                            />
                                            {errors.issue_date && (
                                                <div className="invalid-feedback">{errors.issue_date}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="mb-4 row align-items-center"
                                        style={{ display: formData.is_no_expired ? "none" : "flex" }}
                                    >
                                        <label className="form-label-title col-sm-3 mb-0">Ngày hết hạn</label>
                                        <div className="col-sm-9">
                                            <input
                                                className={`form-control ${errors.expired_date ? "is-invalid" : ""}`}
                                                type="datetime-local"
                                                name="expired_date"
                                                value={
                                                    typeof formData.expired_date === "string"
                                                        ? formData.expired_date.split("T")[0]
                                                        : ""
                                                }
                                                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                                                disabled={formData.is_no_expired}
                                            />
                                            {errors.expired_date && (
                                                <div className="invalid-feedback">{errors.expired_date}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4 row align-items-center">
                                        <label className="form-label-title col-sm-3 mb-0">Loại</label>
                                        <div className="col-sm-9">
                                            <select
                                                className={`form-control ${errors.type ? "is-invalid" : ""}`}
                                                name="type"
                                                value={formData.type}
                                                onChange={
                                                    handleChange as React.ChangeEventHandler<HTMLSelectElement>
                                                }
                                            >
                                                <option value="">Lựa chọn</option>
                                                <option value="voucher">Voucher</option>
                                                <option value="diamond">Kim cương</option>
                                                <option value="acc_game">Tài khoản game</option>
                                                <option value="combine">Kết hợp</option>
                                            </select>
                                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                        </div>
                                    </div>

                                    {["voucher", "acc_game", "combine"].includes(formData.type) && (
                                        <div className="mb-4 row align-items-center">
                                            <label className="form-label-title col-sm-3 mb-0">
                                                Chọn{" "}
                                                {formData.type === "voucher"
                                                    ? "Voucher"
                                                    : formData.type === "acc_game"
                                                        ? "Tài khoản game"
                                                        : "Kết hợp"}
                                            </label>
                                            <div className="col-sm-9">
                                                <select
                                                    className={`form-control ${
                                                        errors.selectedItemIds ? "is-invalid" : ""
                                                    }`}
                                                    multiple={true}
                                                    value={selectedItemIds.map(String)}
                                                    onChange={handleItemChange}
                                                >
                                                    <option value="">Chọn nhiều mục</option>
                                                    {/*{formData.type === "combine" &&*/}
                                                    {/*    Array.isArray(combineOptions) &&*/}
                                                    {/*    combineOptions.length > 0 && (*/}
                                                    {/*        <>*/}
                                                    {/*            {combineOptions[0].length > 0 && (*/}
                                                    {/*                <optgroup label="Vouchers">*/}
                                                    {/*                    {combineOptions[0].map((item) => (*/}
                                                    {/*                        <option key={item.id} value={item.id}>*/}
                                                    {/*                            {item.name}*/}
                                                    {/*                        </option>*/}
                                                    {/*                    ))}*/}
                                                    {/*                </optgroup>*/}
                                                    {/*            )}*/}
                                                    {/*            {combineOptions[1].length > 0 && (*/}
                                                    {/*                <optgroup label="Products">*/}
                                                    {/*                    {combineOptions[1].map((item) => (*/}
                                                    {/*                        <option key={item.id} value={item.id}>*/}
                                                    {/*                            {item.name}*/}
                                                    {/*                        </option>*/}
                                                    {/*                    ))}*/}
                                                    {/*                </optgroup>*/}
                                                    {/*            )}*/}
                                                    {/*        </>*/}
                                                    {/*    )}*/}
                                                    {formData.type === "voucher" &&
                                                        Array.isArray(voucherOptions) &&
                                                        voucherOptions.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    {formData.type === "acc_game" &&
                                                        Array.isArray(accGameOptions) &&
                                                        accGameOptions.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors.selectedItemIds && (
                                                    <div className="invalid-feedback">{errors.selectedItemIds}</div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4 d-flex gap-2 col-sm-12 col-md-6 justify-content-center">
                                        <button type="submit" className="btn btn-solid flex-grow-1">
                                            {isEditing ? "Cập nhật" : "Lưu"}
                                        </button>
                                        <Link
                                            href="/admin/lucky-draws"
                                            className="btn btn-warning flex-grow-1"
                                        >
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
    );
}