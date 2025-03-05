"use client"
import {Table, Tag} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {ITransaction} from "@/app/interfaces/ITransaction";
import {useEffect, useState} from "react";
import api from "@/app/services/axiosService";
import {DateTimeISO8601ToUFFAndUTCP7} from "@/app/services/commonService";

export default function CardChargeHistory({ mt = 'mt-0' }: {mt: string}) {

    const [histories, setHistories] = useState<ITransaction[]>([])
    const fetchCardChargeHistory = async () => {
        try {
            const response = await api.get("clients/get-card-charge-histories")
            setHistories(response.data.histories || [])
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        fetchCardChargeHistory();
    }, [])


    const columns: ColumnsType<ITransaction> = [
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                console.log(status);
                let color = '';
                let text = '';
                switch (String(status)) {
                    case '1':
                        color = 'green';
                        text = 'Thẻ đúng'
                        break;
                    case '2':
                        color = 'blue';
                        text = 'Sai mệnh giá'
                        break;
                    case '3':
                        color = 'red';
                        text = 'Thẻ lỗi'
                        break;
                    default:
                        color = 'yellow';
                        text = 'Thẻ chờ'
                }
                return <Tag color={color}><p className={`text-black`}>{text}</p></Tag>;
            },
        },
        { title: 'Mã nạp', dataIndex: 'code', key: 'code', align: 'center' },
        { title: 'Serial', dataIndex: 'serial', key: 'serial', align: 'center' },
        { title: 'Mạng', dataIndex: 'telco', key: 'telco', align: 'center' },
        { title: 'Tổng gửi', dataIndex: 'declared_value', key: 'declared_value', align: 'center' },
        { title: 'Tổng thực', dataIndex: 'value', key: 'value', align: 'center' },
        // { title: 'Phí', dataIndex: 'fee', key: 'fee', align: 'center' },
        // { title: 'Phạt', dataIndex: 'penalty', key: 'penalty', align: 'center' },
        { title: 'Nhận', dataIndex: 'amount', key: 'amount', align: 'center' },
        {
            title: 'Ngày tháng',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center',
            render: (text) => DateTimeISO8601ToUFFAndUTCP7(text),
        },
        {
            title: 'Request ID',
            dataIndex: 'request_id',
            key: 'request_id',
        },
    ];

    // const totalSent = histories.reduce((sum, item) => sum + item.declared_value, 0);
    // const totalReal = histories.reduce((sum, item) => sum + item.value, 0);
    // const totalReceived = histories.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className={`${mt}`}>
            <h2 className="text-center text-xl font-bold mb-4">Lịch sử nạp thẻ</h2>
            <Table
                columns={columns}
                dataSource={histories.map((history) => ({ ...history, key: history.id }))}
                pagination={false}
                bordered
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={11} align="right">
                            {/*<Space>*/}
                            {/*    <span>Tổng gửi: <strong>{totalSent.toLocaleString()}</strong></span>*/}
                            {/*    <span>| Tổng thực: <strong>{totalReal.toLocaleString()}</strong></span>*/}
                            {/*    <span>| Số tiền: <strong>{totalReceived.toLocaleString()}</strong></span>*/}
                            {/*</Space>*/}
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
        </div>
    );
}