"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, Descriptions, List, Typography, Tag } from "antd";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import { statusLabels, PaymentStatus } from "@/app/models/entities/Order";

const { Title, Text } = Typography;

interface OrderItem {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
}

interface Order {
    id: number;
    user_id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    total_amount: number;
    total_product_price: number;
    voucher_discount: number;
    voucher_code: string | null;
    status: string;
    payment_status: string;
    created_at: string;
    items: OrderItem[];
}

export default function OrderDetailPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/dang-nhap");
            return;
        }

        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/clients/my-order/${params.id}`);
                setOrder(response.data);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Có lỗi khi tải chi tiết đơn hàng");
                router.push("/orders");
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.id && params.id) {
            fetchOrder();
        }
    }, [session, status, params.id, router]);

    if (!order) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto mt-16 px-4">
            <Title level={2} className="text-center mb-8">
                Chi tiết đơn hàng #{order.id}
            </Title>
            <Card loading={loading}>
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Tên khách hàng">{order.customer_name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{order.customer_email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{order.customer_phone}</Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt hàng">
                        {new Date(order.created_at).toLocaleString("vi-VN")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền sản phẩm">
                        {order.total_product_price?.toLocaleString("vi-VN")} đ
                    </Descriptions.Item>
                    <Descriptions.Item label="Giảm giá">
                        {order.voucher_discount?.toLocaleString("vi-VN")} đ
                        {order.voucher_code && ` (Mã: ${order.voucher_code})`}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền thanh toán">
                        {order.total_amount?.toLocaleString("vi-VN")} đ
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn hàng">
                        <Tag color={order.status === "completed" ? "green" : "blue"}>
                            {statusLabels[order.status]}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                        <Tag color={order.payment_status === PaymentStatus.PAID ? "green" : "red"}>
                            Đã thanh toán
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>

                <Title level={4} className="mt-8">
                    Sản phẩm
                </Title>
                <List
                    dataSource={order.items}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                title={item.product_name}
                                description={
                                    <div>
                                        <Text>Số lượng: {item.quantity}</Text>
                                        <br />
                                        <Text>Đơn giá: {item.unit_price.toLocaleString("vi-VN")} đ</Text>
                                        <br />
                                        <Text>
                                            Tổng: {(item.quantity * item.unit_price).toLocaleString("vi-VN")} đ
                                        </Text>
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