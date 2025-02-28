"use client"
import { Card, Descriptions, Tag, Button } from "antd";
import React, { useEffect, useState } from "react";
import {CardStatus} from "@/app/models/entities/CardTransaction";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import {useParams, useRouter} from "next/navigation";
import {ITransaction} from "@/app/interfaces/ITransaction";
import {DateTimeISO8601ToUFFAndUTCP7, maskDigits, numberFormat} from "@/app/services/commonService";
import Link from "next/link";
import {IUser} from "@/app/interfaces/IUser";


const TransactionDetail = () => {
    const params = useParams()
    const router = useRouter();
    const [transaction, setTransaction] = useState<ITransaction | null>(null);
    const [user, setUser] = useState<IUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTransaction = async () => {
            setLoading(true)
            try {
                const response = await api.get(`transactions/${params.id}`)
                if (response) setTransaction(response.data.transaction); setUser(response.data.user)
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false)
            }
        }
        fetchTransaction();
    }, [params.id]);

    const statusColors: Record<number, string> = {
        [CardStatus.SUCCESS_CORRECT]: "green",
        [CardStatus.SUCCESS_INCORRECT]: "blue",
        [CardStatus.FAILED]: "red",
        [CardStatus.MAINTENANCE]: "orange",
        [CardStatus.PENDING]: "gray",
        [CardStatus.SUBMIT_FAILED]: "volcano",
    };

    if (loading) return <Loading/>;
    if (!transaction) return <p>Không tìm thấy giao dịch</p>;

    return (
            <Card title="Chi tiết thông tin giao dịch" extra={<Button onClick={() => router.push("/admin/transactions")}>Quay lại</Button>}>
            <Descriptions bordered column={1}>
                {/*<Descriptions.Item label="Mã giao dịch">{transaction.id}</Descriptions.Item>*/}
                <Descriptions.Item label="Mã yêu cầu"><span className="text-danger fw-bold">{transaction.request_id}</span></Descriptions.Item>
                {
                    user && (
                        <Descriptions.Item label="Người dùng">
                            <div className="d-flex gap-5">
                                <div>
                                    Mã người dùng: {user.user_code} <br/>
                                    Tên người dùng: {user.username} <br/>
                                    Số điện thoại: {user.phone} <br/>
                                    Số dư hiện tại: <span style={{fontSize: 20}}>{numberFormat(user.balance)}</span> vnđ
                                </div>
                                <Link href={`/admin/transactions/${transaction.id}`} className={`text-decoration-underline`}>
                                    xem chi tiết người dùng
                                </Link>
                            </div>
                        </Descriptions.Item>
                    )
                }
                <Descriptions.Item label="Trạng thái">
                    <Tag color={statusColors[transaction.status] || "default"}>
                        {CardStatus[transaction.status] ?? "Không xác định"}
                    </Tag>
                    <Tag color={statusColors[transaction.status] || "default"}>
                        {transaction.message ?? "Không xác định"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item
                    label="Mệnh giá khai báo">{numberFormat(transaction.declared_value)} vnđ</Descriptions.Item>
                <Descriptions.Item label="Giá trị thực">{numberFormat(transaction.value)} vnđ</Descriptions.Item>
                <Descriptions.Item label="Số tiền">{numberFormat(transaction.amount)} vnđ</Descriptions.Item>
                <Descriptions.Item label="Mã thẻ">{maskDigits(transaction.code)}</Descriptions.Item>
                <Descriptions.Item label="Số serial">{maskDigits(transaction.serial)}</Descriptions.Item>
                <Descriptions.Item label="Nhà mạng">{transaction.telco}</Descriptions.Item>
                <Descriptions.Item label="ID giao dịch (Thẻ siêu rẻ)">{transaction.trans_id ?? "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{ DateTimeISO8601ToUFFAndUTCP7(transaction.created_at) }</Descriptions.Item>
                <Descriptions.Item label="Loại">
                    <Tag color="geekblue">{ transaction.command == 'charge' ? "Đổi thẻ" : "Chưa xác định" } </Tag>
                    </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default TransactionDetail;
