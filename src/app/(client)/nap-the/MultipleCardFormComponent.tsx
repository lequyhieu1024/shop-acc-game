"use client";
import { useState } from "react";
import { toast } from "react-toastify";

interface MultipleFormData {
    telco: string;
    price: string;
    code: string;
}

interface MultipleCardFormProps {
    activeTab: string;
    onSubmit: (formData: MultipleFormData, formType: 'multiple') => Promise<void>;
}

export default function MultipleCardFormComponent({ activeTab, onSubmit }: MultipleCardFormProps) {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const cardRules: Record<string, { code: number; serial?: number }> = {
        VIETTEL: { code: 15, serial: 14 },
        VINAPHONE: { code: 14, serial: 14 },
        MOBIFONE: { code: 12, serial: 15 },
        VNMOBI: { code: 12 },
        ZING: { code: 9, serial: 12 },
        GARENA: { code: 10, serial: 10 },
        GATE: { code: 10, serial: 10 },
        VCOIN: { code: 10, serial: 10 },
        SCOIN: { code: 10, serial: 10 },
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const telco = (form.telco as HTMLSelectElement).value;
        const price = (form.price as HTMLSelectElement).value;
        const codeInput = (form.code as HTMLTextAreaElement).value;

        setFormErrors({});

        const errors: { [key: string]: string } = {};

        if (!telco) errors.telco = "Vui lòng chọn nhà mạng!";
        if (!price) errors.price = "Vui lòng chọn mệnh giá!";
        if (!codeInput) errors.code = "Vui lòng nhập mã thẻ và serial!";

        const rule = cardRules[telco];
        if (telco && !rule) errors.telco = "Nhà mạng không hợp lệ!";

        if (codeInput) {
            const lines = codeInput.split("\n").map((line) => line.trim().split(" "));
            for (const [index, [code, serial]] of lines.entries()) {
                if (!code || (rule?.serial && !serial)) {
                    errors.code = `Mã thẻ hoặc serial không đầy đủ (Hàng ${index + 1})!`;
                    break;
                }

                if (!/^\d+$/.test(code)) {
                    errors.code = `Mã thẻ ${code} phải là số (Hàng ${index + 1})!`;
                    break;
                }
                if (rule?.serial && serial && !/^\d+$/.test(serial)) {
                    errors.code = `Số serial ${serial} phải là số (Hàng ${index + 1})!`;
                    break;
                }

                if (rule && code.length !== rule.code) {
                    errors.code = `Mã thẻ phải có ${rule.code} ký tự (Hàng ${index + 1})!`;
                    break;
                }
                if (rule?.serial && serial && serial.length !== rule.serial) {
                    errors.code = `Số serial phải có ${rule.serial} ký tự (Hàng ${index + 1})!`;
                    break;
                }
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        const formData: MultipleFormData = { telco, price, code: codeInput };
        onSubmit(formData, "multiple");
    };

    return (
        <div className={activeTab === "nhieuthe" ? "block" : "hidden"}>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-4">
                        <div>
                            <select className="w-full p-2 border rounded" name="telco" defaultValue="">
                                <option value="">--- Nhà mạng ---</option>
                                {Object.keys(cardRules).map((key) => (
                                    <option key={key} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                            {formErrors.telco && <p className="text-red-500 text-sm">{formErrors.telco}</p>}
                        </div>
                        <div>
                            <select className="w-full p-2 border rounded" name="price" defaultValue="">
                                <option value="">--- Mệnh giá ---</option>
                                {[10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000].map((value) => (
                                    <option key={value} value={value}>
                                        {value.toLocaleString()} đ
                                    </option>
                                ))}
                            </select>
                            {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
                        </div>
                    </div>
                    <div>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows={5}
                            name="code"
                            placeholder="*Nhập serial mã thẻ cách nhau bằng 1 khoảng trống, mỗi thẻ cách nhau bởi 1 dòng, mã thẻ trước, seri sau"
                        />
                        {formErrors.code && <p className="text-red-500 text-sm">{formErrors.code}</p>}
                        <p className="text-red-600"><i>Ví dụ:</i></p>
                        <p className="text-red-600">987654321098765 12345678901234</p>
                        <p className="text-red-600">987654321098765 12345678901234</p>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <button type="submit" className="bg-orange-500 text-white p-4 rounded-lg">
                        <i className="fas fa-upload"></i> Gửi thẻ cào
                    </button>
                </div>
            </form>
        </div>
    );
}
