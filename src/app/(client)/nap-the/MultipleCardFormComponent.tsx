"use client";
import {useState} from "react";
import {toast} from "react-toastify";

interface MultipleFormData {
    telco: string;
    price: string;
    code: string;
}

export default function MultipleCardFormComponent({activeTab, onSubmit}) {
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const cardRules: Record<string, { code: number; serial?: number }> = {
        VIETTEL: {code: 15, serial: 14},
        VINAPHONE: {code: 14, serial: 14},
        MOBIFONE: {code: 12, serial: 15},
        VNMOBI: {code: 12},
        ZING: {code: 9, serial: 12},
        GARENA: {code: 10, serial: 10},
        GATE: {code: 10, serial: 10},
        VCOIN: {code: 10, serial: 10},
        SCOIN: {code: 10, serial: 10},
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const telco = form.telco.value;
        const price = form.price.value;
        const codeInput = form.code.value;

        setFormErrors({});

        let errors: { [key: string]: string } = {};

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
                if (rule?.serial && !/^\d+$/.test(serial)) {
                    errors.code = `Số serial ${serial} phải là số (Hàng ${index + 1})!`;
                    break;
                }

                if (rule && code.length !== rule.code) {
                    errors.code = `Mã thẻ phải có ${rule.code} ký tự (Hàng ${index + 1})!`;
                    break;
                }
                if (rule?.serial && serial.length !== rule.serial) {
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

        if (onSubmit) {
            const formData: MultipleFormData = {
                telco,
                price,
                code: codeInput,
            };
            onSubmit(formData, "multiple");
        }
    };

    return (
        <div className={activeTab === "nhieuthe" ? "block" : "hidden"}>
            <form method="POST" onSubmit={handleSubmit}>
                <input type="hidden" name="_token" value="TAlvzg1NrZAPDFpP1Vb4f42sOHyDG5ZJDlPISDii"/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-4">
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
                        <div>
                            <select className="w-full p-2 border rounded" name="price" defaultValue="">
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
                            {formErrors.price && (
                                <p className="text-red-500 text-sm">{formErrors.price}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <textarea
                            className="w-full p-2 border rounded"
                            rows={5}
                            name="code"
                            placeholder="*Nhập serial mã thẻ cách nhau bằng 1 khoảng trống, mỗi mỗi thẻ cách nhau bởi 1 dòng,mã thẻ trước, seri sau"
                        />
                        {formErrors.code && (
                            <p className="text-red-500 text-sm">{formErrors.code}</p>
                        )}
                        <p className={`text-red-600`}><i>Ví dụ: </i></p>
                        <p className={`text-red-600`}>987654321098765 12345678901234 </p>
                        <p className={`text-red-600`}>987654321098765 12345678901234 </p>
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