import {useState} from "react";

export default function FeeComponent() {
    interface FeeData {
        group: string;
        amounts: { [key: string]: string };
    }

    const feeTables: { [key: string]: FeeData[] } = {
        VIETTEL: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '11%',
                    '20000': '15.5%',
                    '30000': '17%',
                    '50000': '14%',
                    '100000': '14%',
                    '200000': '14%',
                    '300000': '15.5%',
                    '500000': '17.5%',
                    '1000000': '17.5%'
                }
            },
        ],
        VINAPHONE: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '18%',
                    '20000': '18%',
                    '30000': '18%',
                    '50000': '17.5%',
                    '100000': '16.5%',
                    '200000': '15%',
                    '300000': '15%',
                    '500000': '15%'
                }
            },
        ],
        MOBIFONE: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '19%',
                    '20000': '19%',
                    '30000': '19%',
                    '50000': '19%',
                    '100000': '18%',
                    '200000': '16.5%',
                    '300000': '16.5%',
                    '500000': '16.5%'
                }
            },
        ],
        VNMOBI: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '31%',
                    '20000': '31%',
                    '30000': '31%',
                    '50000': '31%',
                    '100000': '31%',
                    '200000': '31%',
                    '300000': '31%',
                    '500000': '31%'
                }
            },
        ],
        ZING: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '12%',
                    '20000': '12%',
                    '50000': '12%',
                    '100000': '12%',
                    '200000': '12%',
                    '500000': '12%',
                    '1000000': '12%'
                }
            },
        ],
        GARENA: [
            {
                group: 'Thành viên',
                amounts: {'20000': '10.5%', '50000': '10.5%', '100000': '10.5%', '200000': '10.5%', '500000': '10.5%'}
            },
        ],
        VCOIN: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '10%',
                    '20000': '10%',
                    '50000': '10%',
                    '100000': '10%',
                    '200000': '10%',
                    '300000': '10%',
                    '500000': '10%',
                    '1000000': '10%',
                    '2000000': '11.5%',
                    '5000000': '12%',
                    '10000000': '15%'
                }
            }
        ],
        SCOIN: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '15%',
                    '20000': '15%',
                    '50000': '15%',
                    '100000': '15%',
                    '200000': '15%',
                    '300000': '15%',
                    '500000': '15%',
                    '1000000': '15%',
                    '2000000': '15.5%',
                    '5000000': '15.5%'
                }
            }
        ],
    };

    const [activeFeeTab, setActiveFeeTab] = useState<string>('VIETTEL');
    const handleFeeTabChange = (tabId: string): void => {
        setActiveFeeTab(tabId);
    };
    return (
        <div className="mt-8">
            <h2 className="text-center text-xl font-bold mb-4">Bảng phí đổi thẻ cào</h2>
            <ul className="flex flex-wrap border-b mb-4">
                {['VIETTEL', 'VINAPHONE', 'MOBIFONE', 'VNMOBI', 'ZING', 'GARENA', 'VCOIN', 'SCOIN'].map((tab) => (
                    <li key={tab} className="m-1">
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
    )
}