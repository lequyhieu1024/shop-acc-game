"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { List ,Tag, Button } from "antd";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import { statusLabels, PaymentStatus } from "@/app/models/entities/Order";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                            Đơn Hàng Của Tôi
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Theo dõi và quản lý đơn hàng của bạn
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-purple-500/20 shadow-xl">
                        <List
                            loading={loading}
                            dataSource={orders}
                            renderItem={(order) => (
                                <List.Item
                                    className="mb-4 bg-gray-700/30 rounded-lg p-4 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
                                    actions={[
                                        <Button
                                            key="view"
                                            type="primary"
                                            onClick={() => router.push(`/don-hang-cua-toi/${order.id}`)}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:from-purple-700 hover:to-blue-700"
                                        >
                                            Xem chi tiết
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        style={{ paddingLeft: 10}}
                                        title={
                                            <span className="text-xl font-semibold text-purple-400">
                                                Đơn hàng #{order.id}
                                            </span>
                                        }
                                        description={
                                            <div className="space-y-2 text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">Tổng tiền:</span>
                                                    <span className="text-green-400 font-medium">
                                                        {order.total_amount?.toLocaleString("vi-VN")} đ
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">Giảm giá:</span>
                                                    <span className="text-red-400">
                                                        {order.voucher_discount?.toLocaleString("vi-VN") ?? 0} đ
                                                        {order.voucher_code && (
                                                            <span className="text-purple-400 ml-1">
                                                                (Mã: {order.voucher_code})
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">Ngày đặt:</span>
                                                    <span>{new Date(order.created_at).toLocaleString("vi-VN")}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Tag 
                                                        color={order.status === "completed" ? "green" : "blue"}
                                                        className="px-3 py-1 rounded-full"
                                                    >
                                                        {statusLabels[order.status]}
                                                    </Tag>
                                                    <Tag 
                                                        color={order.payment_status === PaymentStatus.PAID ? "green" : "red"}
                                                        className="px-3 py-1 rounded-full"
                                                    >
                                                        {order.payment_status === PaymentStatus.PAID ? "Đã thanh toán" : "Chưa thanh toán"}
                                                    </Tag>
                                                </div>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}