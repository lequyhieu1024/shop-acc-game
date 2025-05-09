"use client";
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import MethodPayment from './MethodPayment';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import api from '@/app/services/axiosService';
import { PaymentMethod, PaymentStatus } from '@/app/models/entities/Order';
import { toast } from 'react-toastify';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CheckoutFormValues {
    name: string;
    phone: string;
    email: string;
    voucherCode?: string;
}

const { Title, Text } = Typography;

export default function CheckoutPage() {
    const [form] = Form.useForm<CheckoutFormValues>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isWebPurchaseLoading, setIsWebPurchaseLoading] = useState(false);
    const [isAdminPurchaseLoading, setIsAdminPurchaseLoading] = useState(false);
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedItems = localStorage.getItem('cartItems');
            setCartItems(storedItems ? JSON.parse(storedItems) : []);
        }
    }, []);

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const finalAmount = totalAmount - voucherDiscount;

    const handleWebPurchase = async () => {
        if (!session?.user?.id) {
            toast.error("Vui lòng đăng nhập để mua nick!");
            router.push("/dang-nhap");
            return;
        }

        try {
            setIsWebPurchaseLoading(true);
            const values = await form.validateFields();
            
            // Kiểm tra số dư
            const balanceResponse = await api.get('/user/balance');
            const userBalance = balanceResponse.data.balance;

            if (userBalance < finalAmount) {
                toast.error(`Số dư không đủ! Số dư hiện tại: ${userBalance.toLocaleString('vi-VN')} đ, Số tiền cần thanh toán: ${finalAmount.toLocaleString('vi-VN')} đ`);
                return;
            }

            // Kiểm tra voucher nếu có
            if (values.voucherCode) {
                const voucherResponse = await api.post('/vouchers/validate', {
                    code: values.voucherCode,
                    amount: totalAmount
                });
                
                if (!voucherResponse.data.valid) {
                    toast.error(`Mã giảm giá không hợp lệ: ${voucherResponse.data.message}`);
                    return;
                }
            }

            for (const item of cartItems) {
                const productResponse = await api.get(`/products/${item.id}`);
                if (productResponse.data.quantity < item.quantity) {
                    toast.error(`Sản phẩm ${item.name} chỉ còn ${productResponse.data.quantity} sản phẩm, không đủ số lượng bạn yêu cầu.`);
                    return;
                }
            }

             await api.post('/orders', {
                user_id: session.user.id,
                customer_name: values.name,
                customer_email: values.email,
                customer_phone: values.phone,
                total_amount: finalAmount,
                payment_method: PaymentMethod.THIRD_PARTY,
                payment_status: PaymentStatus.PAID,
                order_items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price
                }))
            });

            setCartItems([]);
            localStorage.removeItem("cartItems");
            localStorage.removeItem("totalItems");

            toast.success('Đặt hàng thành công! Vui lòng kiểm tra email để xem chi tiết đơn hàng.');
            window.location.href = '/';
        } catch (error: any) {
            console.error('Error during purchase:', error);
            
            let errorMessage = 'Có lỗi xảy ra khi xử lý thanh toán';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            toast.error(errorMessage);
        } finally {
            setIsWebPurchaseLoading(false);
        }
    };

    const handleAdminPurchase = () => {
        setIsAdminPurchaseLoading(true);
        setIsModalVisible(true);
        setIsAdminPurchaseLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto mt-16 px-4">
            <Title level={2} className="text-center mb-8">
                Trang Thanh Toán
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card title="Thông tin khách hàng" className="shadow-md">
                        <Form
                            form={form}
                            layout="vertical"
                            className="space-y-4"
                        >
                            <Form.Item
                                label="Họ và tên"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item
                                label="Mã giảm giá (nếu có)"
                                name="voucherCode"
                            >
                                <Input placeholder="Nhập mã giảm giá" />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Đơn hàng của bạn" className="shadow-md">
                        <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <Text className='font-medium'>
                                        {item.name} x {item.quantity}
                                    </Text>
                                    <Text className='font-medium text-red-500'>
                                        {(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                    </Text>
                                </div>
                            ))}

                            {voucherDiscount > 0 && (
                                <div className="flex justify-between text-green-500">
                                    <Text>Giảm giá:</Text>
                                    <Text>-{voucherDiscount.toLocaleString('vi-VN')} đ</Text>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-red-500">
                                    <Text>Tổng cộng:</Text>
                                    <Text>{finalAmount.toLocaleString('vi-VN')} đ</Text>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    type="primary"
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                    onClick={handleWebPurchase}
                                    loading={isWebPurchaseLoading}
                                >
                                    Mua nick qua web
                                </Button>
                                <Button
                                    type="primary"
                                    className="w-full bg-green-500 hover:bg-green-600"
                                    onClick={handleAdminPurchase}
                                    loading={isAdminPurchaseLoading}
                                >
                                    Mua nick qua admin
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <MethodPayment
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
}
