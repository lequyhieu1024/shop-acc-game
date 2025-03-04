"use client";
import { useState } from "react";
import { toast } from "react-toastify";

interface SingleFormData {
    telco: string;
    code: string;
    serial: string;
    amount: string;
}

export default function SingleCardFormComponent({ activeTab, onSubmit }) {
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
        const telco = form.elements["telco"].value;
        const code = form.elements["code"].value;
        const serial = form.elements["serial"].value;
        const amount = form.elements["amount"].value;

        setFormErrors({});

        let errors: { [key: string]: string } = {};

        if (!telco) errors.telco = "Vui lòng chọn nhà mạng!";
        if (!code) errors.code = "Vui lòng nhập mã thẻ!";
        if (!serial) errors.serial = "Vui lòng nhập số serial!";
        if (!amount) errors.amount = "Vui lòng chọn mệnh giá!";

        if (code && !/^\d+$/.test(code)) errors.code = "Mã thẻ phải là số!";
        if (serial && !/^\d+$/.test(serial)) errors.serial = "Số serial phải là số!";

        const rule = cardRules[telco];
        if (telco && !rule) errors.telco = "Nhà mạng không hợp lệ!";
        if (code && rule && code.length !== rule.code)
            errors.code = `Mã thẻ phải có ${rule.code} ký tự!`;
        if (serial && rule?.serial && serial.length !== rule.serial)
            errors.serial = `Số serial phải có ${rule.serial} ký tự!`;

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        if (onSubmit) {
            const formData: SingleFormData = {
                telco,
                code,
                serial,
                amount,
            };
            onSubmit(formData, "single");
        }
    };

    return (
        <div className={activeTab === "theoform" ? "block" : "hidden"}>
            <form method="POST" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div>
                        <select className="w-full p-2 border rounded" name="telco" defaultValue="">
                            <option value="">--- Nhà mạng ---</option>
                            <option value="VIETTEL">Viettel</option>
                            <option value="VINAPHONE">Vina</option>
                            <option value="MOBIFONE">Mobifone</option>
                            <option value="VNMOBI">Vietnammobi</option>
                            <option value="ZING">Zing</option>
                            <option value="GARENA">Garena</option>
                            <option value="GATE">GATE</option>
                            <option value="VCOIN">Vcoin</option>
                            <option value="SCOIN">Scoin</option>
                        </select>
                        {formErrors.telco && (
                            <p className="text-red-500 text-sm">{formErrors.telco}</p>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            name="code"
                            placeholder="Mã nạp"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() =>
                                handleCopy(
                                    (document.querySelector(`input[name="code"]`) as HTMLInputElement)?.value || ""
                                )
                            }
                        >
                            <i className="fas fa-paste"></i>
                        </button>
                        {formErrors.code && (
                            <p className="text-red-500 text-sm">{formErrors.code}</p>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            name="serial"
                            placeholder="Serial"
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() =>
                                handleCopy(
                                    (document.querySelector(`input[name="serial"]`) as HTMLInputElement)?.value || ""
                                )
                            }
                        >
                            <i className="fas fa-paste"></i>
                        </button>
                        {formErrors.serial && (
                            <p className="text-red-500 text-sm">{formErrors.serial}</p>
                        )}
                    </div>
                    <div>
                        <select className="w-full p-2 border rounded" name="amount" defaultValue="">
                            <option value="">--- Mệnh giá ---</option>
                            <option value="10000">10,000 đ - Thực nhận 8,750 đ</option>
                            <option value="20000">20,000 đ - Thực nhận 17,100 đ</option>
                            <option value="30000">30,000 đ - Thực nhận 25,200 đ</option>
                            <option value="50000">50,000 đ - Thực nhận 43,500 đ</option>
                            <option value="100000">100,000 đ - Thực nhận 87,000 đ</option>
                            <option value="200000">200,000 đ - Thực nhận 174,000 đ</option>
                            <option value="300000">300,000 đ - Thực nhận 258,000 đ</option>
                            <option value="500000">500,000 đ - Thực nhận 427,500 đ</option>
                            <option value="1000000">1,000,000 đ - Thực nhận 850,000 đ</option>
                        </select>
                        {formErrors.amount && (
                            <p className="text-red-500 text-sm">{formErrors.amount}</p>
                        )}
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