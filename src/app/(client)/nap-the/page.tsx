"use client"
import { useState, FormEvent } from 'react';

// Define types for form rows
interface CardRow {
    id: number;
}

// Define types for fee table data (example for Viettel, extend for others)
// Define types for fee table data
interface FeeData {
    group: string;
    amounts: { [key: string]: string };
}

const feeTables: { [key: string]: FeeData[] } = {
    VIETTEL: [
        { group: 'Thành viên', amounts: { '10000': '12.5%', '20000': '14.5%', '30000': '16%', '50000': '13%', '100000': '13%', '200000': '13%', '300000': '14%', '500000': '14.5%', '1000000': '15%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '11.5%', '20000': '14.5%', '30000': '15%', '50000': '13%', '100000': '13%', '200000': '13%', '300000': '13%', '500000': '13.5%', '1000000': '14%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '11%', '20000': '14%', '30000': '14.5%', '50000': '12.5%', '100000': '12.5%', '200000': '12.5%', '300000': '12.5%', '500000': '13%', '1000000': '13.5%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '10%', '20000': '13%', '30000': '13.5%', '50000': '11.5%', '100000': '11.5%', '200000': '11.5%', '300000': '11.5%', '500000': '12%', '1000000': '12.5%' } },
    ],
    VINAPHONE: [
        { group: 'Thành viên', amounts: { '10000': '14%', '20000': '14%', '30000': '14%', '50000': '13.5%', '100000': '11%', '200000': '11%', '300000': '11%', '500000': '11%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '13%', '20000': '13%', '30000': '13%', '50000': '12.5%', '100000': '10%', '200000': '10%', '300000': '10%', '500000': '10%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '12.5%', '20000': '12.5%', '30000': '12.5%', '50000': '12%', '100000': '9.5%', '200000': '9.5%', '300000': '9.5%', '500000': '9.5%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '11.5%', '20000': '11.5%', '30000': '11.5%', '50000': '11%', '100000': '8.5%', '200000': '8.5%', '300000': '8.5%', '500000': '8.5%' } },
    ],
    MOBIFONE: [
        { group: 'Thành viên', amounts: { '10000': '18%', '20000': '18%', '30000': '18%', '50000': '17%', '100000': '17%', '200000': '16%', '300000': '16%', '500000': '16%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '17%', '20000': '17%', '30000': '17%', '50000': '16%', '100000': '16%', '200000': '15%', '300000': '15%', '500000': '15%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '16.5%', '20000': '16.5%', '30000': '16.5%', '50000': '15.5%', '100000': '15.5%', '200000': '14.5%', '300000': '14.5%', '500000': '14.5%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '15.5%', '20000': '15.5%', '30000': '15.5%', '50000': '14.5%', '100000': '14.5%', '200000': '13.5%', '300000': '13.5%', '500000': '13.5%' } },
    ],
    VNMOBI: [
        { group: 'Thành viên', amounts: { '10000': '33%', '20000': '33%', '30000': '33%', '50000': '33%', '100000': '33%', '200000': '33%', '300000': '33%', '500000': '33%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '32%', '20000': '32%', '30000': '32%', '50000': '32%', '100000': '32%', '200000': '32%', '300000': '32%', '500000': '32%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '31.5%', '20000': '31.5%', '30000': '31.5%', '50000': '31.5%', '100000': '31.5%', '200000': '31.5%', '300000': '31.5%', '500000': '31.5%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '30.5%', '20000': '30.5%', '30000': '30.5%', '50000': '30.5%', '100000': '30.5%', '200000': '30.5%', '300000': '30.5%', '500000': '30.5%' } },
    ],
    ZING: [
        { group: 'Thành viên', amounts: { '10000': '12.5%', '20000': '12.5%', '50000': '12.5%', '100000': '12.5%', '200000': '12.5%', '500000': '12.5%', '1000000': '12.5%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '11.5%', '20000': '11.5%', '50000': '11.5%', '100000': '11.5%', '200000': '11.5%', '500000': '11.5%', '1000000': '11.5%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '11%', '20000': '11%', '50000': '11%', '100000': '11%', '200000': '11%', '500000': '11%', '1000000': '11%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '10%', '20000': '10%', '50000': '10%', '100000': '10%', '200000': '10%', '500000': '10%', '1000000': '10%' } },
    ],
    GARENA: [
        { group: 'Thành viên', amounts: { '20000': '13.5%', '50000': '13.5%', '100000': '13.5%', '200000': '13.5%', '500000': '13.5%' } },
        { group: '100 giao dịch/tháng', amounts: { '20000': '12.5%', '50000': '12.5%', '100000': '12.5%', '200000': '12.5%', '500000': '12.5%' } },
        { group: 'Có Bảo Hiểm', amounts: { '20000': '12%', '50000': '12%', '100000': '12%', '200000': '12%', '500000': '12%' } },
        { group: 'Đối tác/Web con', amounts: { '20000': '11.5%', '50000': '11.5%', '100000': '11.5%', '200000': '10%', '500000': '11.5%' } },
    ],
    GATE: [
        { group: 'Thành viên', amounts: { '10000': '18.5%', '20000': '18.5%', '30000': '18.5%', '50000': '18.5%', '100000': '18.5%', '200000': '18.5%', '300000': '18.5%', '500000': '18.5%', '1000000': '18.5%', '2000000': '18.5%', '5000000': '18.5%', '10000000': '18.5%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '17.5%', '20000': '17.5%', '30000': '17.5%', '50000': '17.5%', '100000': '17.5%', '200000': '17.5%', '300000': '17.5%', '500000': '17.5%', '1000000': '17.5%', '2000000': '17.5%', '5000000': '17.5%', '10000000': '17.5%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '17%', '20000': '17%', '30000': '17%', '50000': '17%', '100000': '17%', '200000': '17%', '300000': '17%', '500000': '17%', '1000000': '17%', '2000000': '17%', '5000000': '17%', '10000000': '17%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '16%', '20000': '16%', '30000': '16%', '50000': '16%', '100000': '16%', '200000': '16%', '300000': '16%', '500000': '16%', '1000000': '16%', '2000000': '16%', '5000000': '16%', '10000000': '16%' } },
    ],
    VCOIN: [
        { group: 'Thành viên', amounts: { '10000': '12%', '20000': '12%', '50000': '12%', '100000': '12%', '200000': '12%', '300000': '12%', '500000': '12%', '1000000': '12%', '2000000': '13.5%', '5000000': '13.5%', '10000000': '15.5%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '11%', '20000': '11%', '50000': '11%', '100000': '11%', '200000': '11%', '300000': '11%', '500000': '11%', '1000000': '11%', '2000000': '12.5%', '5000000': '12.5%', '10000000': '14.5%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '10.5%', '20000': '10.5%', '50000': '10.5%', '100000': '10.5%', '200000': '10.5%', '300000': '10.5%', '500000': '10.5%', '1000000': '10.5%', '2000000': '12%', '5000000': '12%', '10000000': '14%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '9.5%', '20000': '9.5%', '50000': '9.5%', '100000': '9.5%', '200000': '9.5%', '300000': '9.5%', '500000': '9.5%', '1000000': '9.5%', '2000000': '11%', '5000000': '11%', '10000000': '13%' } },
    ],
    SCOIN: [
        { group: 'Thành viên', amounts: { '10000': '12%', '20000': '12%', '50000': '12%', '100000': '11.5%', '200000': '12%', '300000': '12%', '500000': '12%', '1000000': '12%', '2000000': '12%', '5000000': '13.5%' } },
        { group: '100 giao dịch/tháng', amounts: { '10000': '11%', '20000': '11%', '50000': '11%', '100000': '10.5%', '200000': '11%', '300000': '11%', '500000': '11%', '1000000': '11%', '2000000': '11%', '5000000': '12.5%' } },
        { group: 'Có Bảo Hiểm', amounts: { '10000': '10.5%', '20000': '10.5%', '50000': '10.5%', '100000': '10%', '200000': '10.5%', '300000': '10.5%', '500000': '10.5%', '1000000': '10.5%', '2000000': '10.5%', '5000000': '12%' } },
        { group: 'Đối tác/Web con', amounts: { '10000': '9.5%', '20000': '9.5%', '50000': '9.5%', '100000': '9%', '200000': '9.5%', '300000': '9.5%', '500000': '9.5%', '1000000': '9.5%', '2000000': '9.5%', '5000000': '11%' } },
    ],
};
// Define the component
export default function ChargeCard() {
    // State with TypeScript types
    const [activeTab, setActiveTab] = useState<string>('theoform');
    const [activeFeeTab, setActiveFeeTab] = useState<string>('VIETTEL');
    const [rows, setRows] = useState<CardRow[]>([{ id: 1 }]);

    // Event handlers with typed parameters
    const handleTabChange = (tabId: string): void => {
        setActiveTab(tabId);
    };

    const handleFeeTabChange = (tabId: string): void => {
        setActiveFeeTab(tabId);
    };

    const addRow = (): void => {
        setRows((prevRows) => [...prevRows, { id: prevRows.length + 1 }]);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>, formType: 'single' | 'multiple'): void => {
        e.preventDefault();
        console.log(`Form submitted: ${formType}`);
        // Replace with API call logic
    };

    const handleCopy = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-center text-2xl font-bold mb-2">Đổi thẻ cào</h1>
                <p className="text-gray-700">
                    <strong className="text-red-600">
                        - Không nhận API từ game bài, thẻ ăn cắp, lừa đảo, không rõ nguồn gốc, thẻ rút từ visa, credit card... Phát hiện khóa vv không hoàn số dư
                    </strong>
                </p>
                <p className="text-black">
                    - Vui lòng đọc{' '}
                    <a href="https://thesieure.com/news/http-api-tichhop247-com.html" className="text-blue-600 font-bold">
                        Điều Khoản
                    </a>
                    , Đổi thẻ sang thẻ game rẻ hơn tại{' '}
                    <a href="https://365pay.vn/" className="text-red-600 font-bold">
                        365pay.vn
                    </a>
                </p>
                <p>
                    - <strong className="text-red-600">Tạo web con đổi thẻ, bán thẻ miễn phí </strong>
                    <a href="https://thesieure.com/news/cap-web-con-doi-the-tich-hop-doi-the-rut-tien-tu-dong-auto-100.html" className="font-bold">
                        tại đây
                    </a>
                    . Hướng dẫn tích hợp API gạch thẻ tự động cho Shop:{' '}
                    <a href="https://thesieure.com/merchant/list" className="font-bold">tại đây</a>
                </p>
                <p>
                    <a href="https://thesieure.com/doithecao" className="font-bold">Lịch sử nạp thẻ tại đây</a>,{' '}
                    Thống kê{' '}
                    <a href="https://thesieure.com/doithecao/san-luong" className="font-bold">tại đây</a>,{' '}
                    Nhận thông báo Telegram{' '}
                    <a href="https://t.me/thongbao_thesieure" className="font-bold">tại đây</a>
                </p>
            </div>

            <div className="tabs-m1">
                <ul className="flex border-b mb-4">
                    <li className="mr-1">
                        <button
                            className={`px-4 py-2 ${activeTab === 'theoform' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTabChange('theoform')}
                        >
                            Đổi thẻ cào
                        </button>
                    </li>
                    <li className="mr-1">
                        <button
                            className={`px-4 py-2 ${activeTab === 'nhieuthe' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => handleTabChange('nhieuthe')}
                        >
                            Đổi nhiều thẻ
                        </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className={`${activeTab === 'theoform' ? 'block' : 'hidden'}`}>
                        <form action="https://thesieure.com/doithecao" method="POST" onSubmit={(e) => handleSubmit(e, 'single')}>
                            <input type="hidden" name="_token" value="TAlvzg1NrZAPDFpP1Vb4f42sOHyDG5ZJDlPISDii" />
                            <div id="createRow">
                                {rows.map((row) => (
                                    <div key={row.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
                                        <div>
                                            <select className="w-full p-2 border rounded" name={`telco[${row.id}]`}>
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
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                name={`code[${row.id}]`}
                                                placeholder="Mã nạp"
                                                onChange={(e) => e.target.value}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                                onClick={() => handleCopy((document.querySelector(`input[name="code[${row.id}]"]`) as HTMLInputElement)?.value || '')}
                                            >
                                                <i className="fas fa-paste"></i>
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded"
                                                name={`serial[${row.id}]`}
                                                placeholder="Serial"
                                                onChange={(e) => e.target.value}
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                                onClick={() => handleCopy((document.querySelector(`input[name="serial[${row.id}]"]`) as HTMLInputElement)?.value || '')}
                                            >
                                                <i className="fas fa-paste"></i>
                                            </button>
                                        </div>
                                        <div>
                                            <select className="w-full p-2 border rounded" name={`amount[${row.id}]`}>
                                                <option>--- Mệnh giá ---</option>
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
                                        </div>
                                        <div className="text-right">
                                            <button type="button" className="bg-green-500 text-white p-2 rounded" onClick={addRow}>
                                                <i className="fas fa-plus-circle"></i> Thêm
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-4">
                                <button type="submit" className="bg-orange-500 text-white p-4 rounded-lg">
                                    <i className="fas fa-upload"></i> Gửi thẻ cào
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Multiple Cards Form */}
                    <div className={`${activeTab === 'nhieuthe' ? 'block' : 'hidden'}`}>
                        <form action="https://thesieure.com/multicharging" method="POST" onSubmit={(e) => handleSubmit(e, 'multiple')}>
                            <input type="hidden" name="_token" value="TAlvzg1NrZAPDFpP1Vb4f42sOHyDG5ZJDlPISDii" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                                <div className="space-y-4">
                                    <select className="w-full p-2 border rounded" name="telco">
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
                                    <select className="w-full p-2 border rounded" name="price">
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
                                </div>
                                <div>
                  <textarea
                      className="w-full p-2 border rounded"
                      rows={3}
                      name="code"
                      placeholder="Nhập serial mã thẻ cách nhau bằng 1 khoảng trống, mỗi mỗi thẻ cách nhau bởi 1 dòng"
                  />
                                </div>
                            </div>
                            <div className="text-center mt-4">
                                <button type="submit" className="bg-orange-500 text-white p-4 rounded-lg">
                                    <i className="fas fa-upload"></i> Gửi thẻ cào
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Fee Section */}
            <div className="mt-8">
                <h2 className="text-center text-xl font-bold mb-4">Bảng phí đổi thẻ cào</h2>
                <ul className="flex flex-wrap border-b mb-4">
                    {['VIETTEL', 'VINAPHONE', 'MOBIFONE', 'VNMOBI', 'ZING', 'GARENA', 'GATE', 'VCOIN', 'SCOIN'].map((tab) => (
                        <li key={tab} className="mr-1">
                            <button
                                className={`px-4 py-2 ${activeFeeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => handleFeeTabChange(tab)}
                            >
                                {tab === 'VNMOBI' ? 'Vietnammobi' : tab.charAt(0) + tab.slice(1).toLowerCase()}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Fee Tab Content */}
                <div className="overflow-x-auto">
                    {feeTables[activeFeeTab] && (
                        <table className="w-full border-collapse border">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-center">Nhóm</th>
                                {Object.keys(feeTables[activeFeeTab][0].amounts).map((amount) => (
                                    <th key={amount} className="border p-2 text-center">
                                        {parseInt(amount).toLocaleString('vi-VN')}đ
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {feeTables[activeFeeTab].map((row, index) => (
                                <tr key={index}>
                                    <td className="border p-2 text-center font-bold">{row.group}</td>
                                    {Object.values(row.amounts).map((fee, idx) => (
                                        <td key={idx} className="border p-2 text-center">{fee}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}