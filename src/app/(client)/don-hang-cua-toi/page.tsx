"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, List, Typography, Tag, Button } from "antd";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import { statusLabels, PaymentStatus } from "@/app/models/entities/Order";

const { Title, Text } = Typography;

interface Order {
    id: number;
    total_amount: number;
    total_product_price: number;
    voucher_discount: number;
    voucher_code: string | null;
    status: string;
    payment_status: string;
    created_at: string;
}

export default function MyOrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/dang-nhap");
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get("/clients/my-order");
                setOrders(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Có lỗi khi tải danh sách đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.id) {
            fetchOrders();
        }
    }, [session, status, router]);

    return (
        <div className="max-w-4xl mx-auto mt-16 px-4">
            <Title level={2} className="text-center mb-8">
                Đơn hàng của tôi
            </Title>
            <Card>
                <List
                    loading={loading}
                    dataSource={orders}
                    renderItem={(order) => (
                        <List.Item
                            actions={[
                                // eslint-disable-next-line react/jsx-key
                                <Button
                                    type="link"
                                    onClick={() => router.push(`/don-hang-cua-toi/${order.id}`)}
                                >
                                    Xem chi tiết
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={`Đơn hàng #${order.id}`}
                                description={
                                    <div>
                                        <Text>
                                            Tổng tiền: {order.total_amount?.toLocaleString("vi-VN")} đ
                                        </Text>
                                        <br />
                                        <Text>
                                            Giảm giá: {order.voucher_discount?.toLocaleString("vi-VN")} đ
                                            {order.voucher_code && ` (Mã: ${order.voucher_code})`}
                                        </Text>
                                        <br />
                                        <Text>Ngày đặt: {new Date(order.created_at).toLocaleString("vi-VN")}</Text>
                                        <br />
                                        <Tag color={order.status === "completed" ? "green" : "blue"}>
                                            {statusLabels[order.status]}
                                        </Tag>
                                        <Tag color={order.payment_status === PaymentStatus.PAID ? "green" : "red"}>
                                            Đã thanh toán
                                        </Tag>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
}