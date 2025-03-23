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

interface LuckyDrawItem {
    item_type: string;
    item_id: number | null;
    item_text?: string;
    probability: number; // Lưu dưới dạng số thập phân (0.1)
}

interface LuckyDrawProps {
    isEditing?: boolean;
    initialData?: ILuckyDraw | null;
}

export default function LuckyDrawForm({ isEditing = false, initialData = null }: LuckyDrawProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [spinning, setSpinning] = useState(false);
    const [wheelSize, setWheelSize] = useState(400); // Kích thước vòng quay (px)
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
    const [selectedItems, setSelectedItems] = useState<LuckyDrawItem[]>([]);
    const [noLuckItems, setNoLuckItems] = useState<LuckyDrawItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
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

                    const response = await api.get(`/lucky-draws/${initialData.id}`);
                    const { items } = response.data;

                    const selected = items.filter((item: LuckyDrawItem) => item.item_type !== "no_luck");
                    const noLuck = items.filter((item: LuckyDrawItem) => item.item_type === "no_luck");

                    // Chuyển probability từ số thập phân sang phần trăm khi hiển thị
                    setSelectedItems(selected.map((item: LuckyDrawItem) => ({
                        ...item,
                        probability: item.probability * 100, // 0.1 -> 10
                    })));
                    setNoLuckItems(noLuck.map((item: LuckyDrawItem) => ({
                        ...item,
                        probability: item.probability * 100, // 0.1 -> 10
                    })));

                    await fetchAdditionalData(initialData.type);
                } else {
                    setNoLuckItems([
                        { item_type: "no_luck", item_id: null, item_text: "Chúc bạn may mắn lần sau", probability: 10 }, // 10% thay vì 0.1
                        { item_type: "no_luck", item_id: null, item_text: "Chúc bạn may mắn lần sau", probability: 10 }, // 10% thay vì 0.1
                    ]);
                }
            } catch (error) {
                console.error("Error fetching lucky draw data:", error);
                toast.error("Đã có lỗi khi tải dữ liệu vòng quay");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isEditing, initialData]);

    const fetchAdditionalData = async (type: string) => {
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
                default:
                    break;
            }
        } catch (error) {
            console.error("Error fetching additional data:", error);
            toast.error("Đã có lỗi khi tải dữ liệu bổ sung");
        }
    };

    const validate = (): { [key: string]: string } => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên vòng quay là bắt buộc.";
        }

        if (!formData.amount_draw || formData.amount_draw <= 0) {
            newErrors.amount_draw = "Giá phải là một số dương.";
        }

        if (!formData.quality.trim()) {
            newErrors.quality = "Chất lượng vòng quay là bắt buộc.";
        }

        if (!formData.is_no_expired) {
            if (!formData.issue_date) {
                newErrors.issue_date = "Ngày phát hành là bắt buộc.";
            }
            if (!formData.expired_date) {
                newErrors.expired_date = "Ngày hết hạn là bắt buộc.";
            }
        }

        if (!formData.type) {
            newErrors.type = "Vui lòng chọn loại vòng quay.";
        }

        if (["voucher", "acc_game", "text"].includes(formData.type) && selectedItems.length === 0) {
            newErrors.selectedItems = "Vui lòng thêm ít nhất một phần thưởng.";
        }

        // Tính tổng tỉ lệ trúng (dạng phần trăm)
        const totalProbability = [...selectedItems, ...noLuckItems].reduce(
            (sum, item) => sum + item.probability,
            0
        );
        if (totalProbability !== 100) {
            newErrors.probability = `Tổng tỉ lệ trúng phải bằng 100%. Hiện tại: ${totalProbability}%`;
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

                if (name === "type" && ["voucher", "acc_game", "text"].includes(value)) {
                    setSelectedItems([]);
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

    const handleAddItem = () => {
        setSelectedItems([...selectedItems, { item_type: formData.type, item_id: null, probability: 0 }]);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...selectedItems];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: field === "probability" ? Number(value) : value, // Lưu giá trị phần trăm
        };
        setSelectedItems(updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(updatedItems);
    };

    const handleAddNoLuckItem = () => {
        setNoLuckItems([
            ...noLuckItems,
            { item_type: "no_luck", item_id: null, item_text: "Chúc bạn may mắn lần sau", probability: 0 },
        ]);
    };

    const handleNoLuckItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...noLuckItems];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: field === "probability" ? Number(value) : value, // Lưu giá trị phần trăm
        };
        setNoLuckItems(updatedItems);
    };

    const handleRemoveNoLuckItem = (index: number) => {
        const updatedItems = noLuckItems.filter((_, i) => i !== index);
        setNoLuckItems(updatedItems);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            toast.error("Vui lòng sửa các lỗi trước khi gửi.");
            return;
        }

        setLoading(true);

        try {
            // Chuyển probability từ phần trăm về số thập phân trước khi gửi
            const items: LuckyDrawItem[] = [...selectedItems, ...noLuckItems].map((item) => ({
                ...item,
                probability: item.probability / 100, // 10% -> 0.1
            }));

            const payload = {
                ...formData,
                accept_draw: formData.accept_draw ? 1 : 0,
                items,
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
            console.error("Error saving lucky draw:", error);
            toast.error("Đã có lỗi xảy ra khi lưu dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleSpin = () => {
        setSpinning(true);
        setTimeout(() => setSpinning(false), 4000); // Dừng sau 4 giây
    };

    const handleZoomIn = () => {
        setWheelSize((prev) => Math.min(prev + 50, 600)); // Tăng kích thước, tối đa 600px
    };

    const handleZoomOut = () => {
        setWheelSize((prev) => Math.max(prev - 50, 300)); // Giảm kích thước, tối thiểu 300px
    };

    // Hàm để lấy tên phần thưởng từ voucherOptions hoặc accGameOptions
    const getItemName = (item: LuckyDrawItem) => {
        if (item.item_type === "no_luck") {
            return item.item_text || "Chúc bạn may mắn lần sau";
        }
        if (item.item_type === "text") {
            return item.item_text || "Phần thưởng tùy chỉnh";
        }
        if (item.item_type === "voucher") {
            const voucher = voucherOptions.find((v) => v.id === item.item_id);
            return voucher ? voucher.name : "Voucher không xác định";
        }
        if (item.item_type === "acc_game") {
            const acc = accGameOptions.find((a) => a.id === item.item_id);
            return acc ? acc.name : "Tài khoản game không xác định";
        }
        return "Phần thưởng không xác định";
    };

    // Tạo danh sách tất cả các phần thưởng (bao gồm cả no_luck) để hiển thị trên vòng quay
    const allItems = [...selectedItems, ...noLuckItems];

    // Mảng màu sắc cho các phần của vòng quay
    const colors = ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1", "#F4A261", "#E2D96F", "#D4A5A5"];

    return loading ? (
        <Loading />
    ) : (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    {/* Form nhập liệu */}
                    <div className="col-lg-6">
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
                                            <small className="mx-1">
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
                                                <option value="text">Text tùy chỉnh</option>
                                            </select>
                                            {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                                        </div>
                                    </div>

                                    {["voucher", "acc_game", "text"].includes(formData.type) && (
                                        <>
                                            <div className="mb-4 row align-items-center">
                                                <label className="form-label-title col-sm-3 mb-0">
                                                    Chúc bạn may mắn lần sau
                                                </label>
                                                <div className="col-sm-9">
                                                    {noLuckItems.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-2 d-flex align-items-center gap-2"
                                                        >
                                                            <input
                                                                className="form-control"
                                                                type="text"
                                                                value={item.item_text || ""}
                                                                onChange={(e) =>
                                                                    handleNoLuckItemChange(
                                                                        index,
                                                                        "item_text",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="Chúc bạn may mắn lần sau"
                                                            />
                                                            <div className="input-group">
                                                                <input
                                                                    className="form-control"
                                                                    type="number"
                                                                    placeholder="Tỉ lệ trúng (%)"
                                                                    value={item.probability}
                                                                    onChange={(e) =>
                                                                        handleNoLuckItemChange(
                                                                            index,
                                                                            "probability",
                                                                            Number(e.target.value)
                                                                        )
                                                                    }
                                                                    min="0"
                                                                    max="100"
                                                                    step="0.1"
                                                                />
                                                                <span className="input-group-text">%</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => handleRemoveNoLuckItem(index)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary mt-2"
                                                        onClick={handleAddNoLuckItem}
                                                    >
                                                        Thêm "Chúc bạn may mắn lần sau"
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-4 row align-items-center">
                                                <label className="form-label-title col-sm-3 mb-0">
                                                    Phần thưởng
                                                </label>
                                                <div className="col-sm-9">
                                                    {selectedItems.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="mb-2 d-flex align-items-center gap-2"
                                                        >
                                                            {formData.type === "text" ? (
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    placeholder="Nhập text phần thưởng"
                                                                    value={item.item_text || ""}
                                                                    onChange={(e) =>
                                                                        handleItemChange(
                                                                            index,
                                                                            "item_text",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            ) : (
                                                                <select
                                                                    className="form-control"
                                                                    value={item.item_id || ""}
                                                                    onChange={(e) =>
                                                                        handleItemChange(
                                                                            index,
                                                                            "item_id",
                                                                            Number(e.target.value)
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="">Chọn phần thưởng</option>
                                                                    {formData.type === "voucher" &&
                                                                        voucherOptions.map((voucher) => (
                                                                            <option
                                                                                key={voucher.id}
                                                                                value={voucher.id}
                                                                            >
                                                                                {voucher.name}
                                                                            </option>
                                                                        ))}
                                                                    {formData.type === "acc_game" &&
                                                                        accGameOptions.map((acc) => (
                                                                            <option key={acc.id} value={acc.id}>
                                                                                {acc.name}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            )}
                                                            <div className="input-group">
                                                                <input
                                                                    className="form-control"
                                                                    type="number"
                                                                    placeholder="Tỉ lệ trúng (%)"
                                                                    value={item.probability}
                                                                    onChange={(e) =>
                                                                        handleItemChange(
                                                                            index,
                                                                            "probability",
                                                                            Number(e.target.value)
                                                                        )
                                                                    }
                                                                    min="0"
                                                                    max="100"
                                                                    step="0.1"
                                                                />
                                                                <span className="input-group-text">%</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger"
                                                                onClick={() => handleRemoveItem(index)}
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary mt-2"
                                                        onClick={handleAddItem}
                                                    >
                                                        Thêm phần thưởng
                                                    </button>
                                                    {errors.selectedItems && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.selectedItems}
                                                        </div>
                                                    )}
                                                    {errors.probability && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.probability}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
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

                    {/* Phần hiển thị demo vòng quay */}
                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-body">
                                <div className="card-header-2">
                                    <h5>Demo vòng quay</h5>
                                </div>
                                {allItems.length > 0 ? (
                                    <div className="wheel-container" style={{ width: wheelSize, height: wheelSize }}>
                                        <div className={`wheel ${spinning ? "spinning" : ""}`}>
                                            {allItems.map((item, index) => {
                                                const angle = (360 / allItems.length) * index;
                                                return (
                                                    <div
                                                        key={index}
                                                        className="wheel-segment"
                                                        style={{
                                                            transform: `rotate(${angle}deg)`,
                                                            backgroundColor: colors[index % colors.length],
                                                        }}
                                                    >
                                                        <div className="segment-content">
                                                            <span>{getItemName(item)}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <button
                                                className="spin-button"
                                                onClick={handleSpin}
                                                disabled={true}
                                            >
                                                QUAY
                                            </button>
                                        </div>
                                        <div className="wheel-pointer"></div>
                                        <div className="controls">
                                            <button
                                                className="control-button"
                                                onClick={handleZoomOut}
                                                disabled={wheelSize <= 300}
                                            >
                                                Thu nhỏ
                                            </button>
                                            <button
                                                className="control-button"
                                                onClick={handleZoomIn}
                                                disabled={wheelSize >= 600}
                                            >
                                                Mở rộng
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center">Vui lòng thêm phần thưởng để xem demo vòng quay.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}