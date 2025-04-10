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
                    '10000': '12.5%',
                    '20000': '14.5%',
                    '30000': '16%',
                    '50000': '13%',
                    '100000': '13%',
                    '200000': '13%',
                    '300000': '14%',
                    '500000': '14.5%',
                    '1000000': '15%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '11.5%',
                    '20000': '14.5%',
                    '30000': '15%',
                    '50000': '13%',
                    '100000': '13%',
                    '200000': '13%',
                    '300000': '13%',
                    '500000': '13.5%',
                    '1000000': '14%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '11%',
                    '20000': '14%',
                    '30000': '14.5%',
                    '50000': '12.5%',
                    '100000': '12.5%',
                    '200000': '12.5%',
                    '300000': '12.5%',
                    '500000': '13%',
                    '1000000': '13.5%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '10%',
                    '20000': '13%',
                    '30000': '13.5%',
                    '50000': '11.5%',
                    '100000': '11.5%',
                    '200000': '11.5%',
                    '300000': '11.5%',
                    '500000': '12%',
                    '1000000': '12.5%'
                }
            },
        ],
        VINAPHONE: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '14%',
                    '20000': '14%',
                    '30000': '14%',
                    '50000': '13.5%',
                    '100000': '11%',
                    '200000': '11%',
                    '300000': '11%',
                    '500000': '11%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '13%',
                    '20000': '13%',
                    '30000': '13%',
                    '50000': '12.5%',
                    '100000': '10%',
                    '200000': '10%',
                    '300000': '10%',
                    '500000': '10%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '12.5%',
                    '20000': '12.5%',
                    '30000': '12.5%',
                    '50000': '12%',
                    '100000': '9.5%',
                    '200000': '9.5%',
                    '300000': '9.5%',
                    '500000': '9.5%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '11.5%',
                    '20000': '11.5%',
                    '30000': '11.5%',
                    '50000': '11%',
                    '100000': '8.5%',
                    '200000': '8.5%',
                    '300000': '8.5%',
                    '500000': '8.5%'
                }
            },
        ],
        MOBIFONE: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '18%',
                    '20000': '18%',
                    '30000': '18%',
                    '50000': '17%',
                    '100000': '17%',
                    '200000': '16%',
                    '300000': '16%',
                    '500000': '16%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '17%',
                    '20000': '17%',
                    '30000': '17%',
                    '50000': '16%',
                    '100000': '16%',
                    '200000': '15%',
                    '300000': '15%',
                    '500000': '15%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '16.5%',
                    '20000': '16.5%',
                    '30000': '16.5%',
                    '50000': '15.5%',
                    '100000': '15.5%',
                    '200000': '14.5%',
                    '300000': '14.5%',
                    '500000': '14.5%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '15.5%',
                    '20000': '15.5%',
                    '30000': '15.5%',
                    '50000': '14.5%',
                    '100000': '14.5%',
                    '200000': '13.5%',
                    '300000': '13.5%',
                    '500000': '13.5%'
                }
            },
        ],
        VNMOBI: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '33%',
                    '20000': '33%',
                    '30000': '33%',
                    '50000': '33%',
                    '100000': '33%',
                    '200000': '33%',
                    '300000': '33%',
                    '500000': '33%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '32%',
                    '20000': '32%',
                    '30000': '32%',
                    '50000': '32%',
                    '100000': '32%',
                    '200000': '32%',
                    '300000': '32%',
                    '500000': '32%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '31.5%',
                    '20000': '31.5%',
                    '30000': '31.5%',
                    '50000': '31.5%',
                    '100000': '31.5%',
                    '200000': '31.5%',
                    '300000': '31.5%',
                    '500000': '31.5%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '30.5%',
                    '20000': '30.5%',
                    '30000': '30.5%',
                    '50000': '30.5%',
                    '100000': '30.5%',
                    '200000': '30.5%',
                    '300000': '30.5%',
                    '500000': '30.5%'
                }
            },
        ],
        ZING: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '12.5%',
                    '20000': '12.5%',
                    '50000': '12.5%',
                    '100000': '12.5%',
                    '200000': '12.5%',
                    '500000': '12.5%',
                    '1000000': '12.5%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '11.5%',
                    '20000': '11.5%',
                    '50000': '11.5%',
                    '100000': '11.5%',
                    '200000': '11.5%',
                    '500000': '11.5%',
                    '1000000': '11.5%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '11%',
                    '20000': '11%',
                    '50000': '11%',
                    '100000': '11%',
                    '200000': '11%',
                    '500000': '11%',
                    '1000000': '11%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '10%',
                    '20000': '10%',
                    '50000': '10%',
                    '100000': '10%',
                    '200000': '10%',
                    '500000': '10%',
                    '1000000': '10%'
                }
            },
        ],
        GARENA: [
            {
                group: 'Thành viên',
                amounts: {'20000': '13.5%', '50000': '13.5%', '100000': '13.5%', '200000': '13.5%', '500000': '13.5%'}
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {'20000': '12.5%', '50000': '12.5%', '100000': '12.5%', '200000': '12.5%', '500000': '12.5%'}
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {'20000': '12%', '50000': '12%', '100000': '12%', '200000': '12%', '500000': '12%'}
            },
            {
                group: 'Đối tác/Web con',
                amounts: {'20000': '11.5%', '50000': '11.5%', '100000': '11.5%', '200000': '10%', '500000': '11.5%'}
            },
        ],
        GATE: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '18.5%',
                    '20000': '18.5%',
                    '30000': '18.5%',
                    '50000': '18.5%',
                    '100000': '18.5%',
                    '200000': '18.5%',
                    '300000': '18.5%',
                    '500000': '18.5%',
                    '1000000': '18.5%',
                    '2000000': '18.5%',
                    '5000000': '18.5%',
                    '10000000': '18.5%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '17.5%',
                    '20000': '17.5%',
                    '30000': '17.5%',
                    '50000': '17.5%',
                    '100000': '17.5%',
                    '200000': '17.5%',
                    '300000': '17.5%',
                    '500000': '17.5%',
                    '1000000': '17.5%',
                    '2000000': '17.5%',
                    '5000000': '17.5%',
                    '10000000': '17.5%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '17%',
                    '20000': '17%',
                    '30000': '17%',
                    '50000': '17%',
                    '100000': '17%',
                    '200000': '17%',
                    '300000': '17%',
                    '500000': '17%',
                    '1000000': '17%',
                    '2000000': '17%',
                    '5000000': '17%',
                    '10000000': '17%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '16%',
                    '20000': '16%',
                    '30000': '16%',
                    '50000': '16%',
                    '100000': '16%',
                    '200000': '16%',
                    '300000': '16%',
                    '500000': '16%',
                    '1000000': '16%',
                    '2000000': '16%',
                    '5000000': '16%',
                    '10000000': '16%'
                }
            },
        ],
        VCOIN: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '12%',
                    '20000': '12%',
                    '50000': '12%',
                    '100000': '12%',
                    '200000': '12%',
                    '300000': '12%',
                    '500000': '12%',
                    '1000000': '12%',
                    '2000000': '13.5%',
                    '5000000': '13.5%',
                    '10000000': '15.5%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '11%',
                    '20000': '11%',
                    '50000': '11%',
                    '100000': '11%',
                    '200000': '11%',
                    '300000': '11%',
                    '500000': '11%',
                    '1000000': '11%',
                    '2000000': '12.5%',
                    '5000000': '12.5%',
                    '10000000': '14.5%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '10.5%',
                    '20000': '10.5%',
                    '50000': '10.5%',
                    '100000': '10.5%',
                    '200000': '10.5%',
                    '300000': '10.5%',
                    '500000': '10.5%',
                    '1000000': '10.5%',
                    '2000000': '12%',
                    '5000000': '12%',
                    '10000000': '14%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '9.5%',
                    '20000': '9.5%',
                    '50000': '9.5%',
                    '100000': '9.5%',
                    '200000': '9.5%',
                    '300000': '9.5%',
                    '500000': '9.5%',
                    '1000000': '9.5%',
                    '2000000': '11%',
                    '5000000': '11%',
                    '10000000': '13%'
                }
            },
        ],
        SCOIN: [
            {
                group: 'Thành viên',
                amounts: {
                    '10000': '12%',
                    '20000': '12%',
                    '50000': '12%',
                    '100000': '11.5%',
                    '200000': '12%',
                    '300000': '12%',
                    '500000': '12%',
                    '1000000': '12%',
                    '2000000': '12%',
                    '5000000': '13.5%'
                }
            },
            {
                group: '100 giao dịch/tháng',
                amounts: {
                    '10000': '11%',
                    '20000': '11%',
                    '50000': '11%',
                    '100000': '10.5%',
                    '200000': '11%',
                    '300000': '11%',
                    '500000': '11%',
                    '1000000': '11%',
                    '2000000': '11%',
                    '5000000': '12.5%'
                }
            },
            {
                group: 'Có Bảo Hiểm',
                amounts: {
                    '10000': '10.5%',
                    '20000': '10.5%',
                    '50000': '10.5%',
                    '100000': '10%',
                    '200000': '10.5%',
                    '300000': '10.5%',
                    '500000': '10.5%',
                    '1000000': '10.5%',
                    '2000000': '10.5%',
                    '5000000': '12%'
                }
            },
            {
                group: 'Đối tác/Web con',
                amounts: {
                    '10000': '9.5%',
                    '20000': '9.5%',
                    '50000': '9.5%',
                    '100000': '9%',
                    '200000': '9.5%',
                    '300000': '9.5%',
                    '500000': '9.5%',
                    '1000000': '9.5%',
                    '2000000': '9.5%',
                    '5000000': '11%'
                }
            },
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
                {['VIETTEL', 'VINAPHONE', 'MOBIFONE', 'VNMOBI', 'ZING', 'GARENA', 'GATE', 'VCOIN', 'SCOIN'].map((tab) => (
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