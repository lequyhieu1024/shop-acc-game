"use client";
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { useEffect, useState } from 'react';
import MethodPayment from './MethodPayment';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import api from '@/app/services/axiosService';
import { PaymentMethod } from '@/app/models/entities/Order';

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
}

const { Title, Text } = Typography;

export default function CheckoutPage() {
    const [form] = Form.useForm<CheckoutFormValues>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const handlePayment = async (paymentMethod: PaymentMethod) => {
        try {
            setIsLoading(true);
            const response = await api.post('/api/purchase', {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                })),
                paymentMethod
            });

            if (response.data.success) {
                // Xóa giỏ hàng
                localStorage.removeItem('cartItems');
                setCartItems([]);

                // Hiển thị thông báo thành công
                alert(response.data.message);

                // Chuyển hướng về trang chủ
                router.push('/');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(error.response?.data?.error || 'Có lỗi xảy ra khi xử lý thanh toán');
        } finally {
            setIsLoading(false);
        }
    };

    const onFinish = (values: CheckoutFormValues) => {
        setIsModalVisible(true);
        console.log(values);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <Title level={2} className="text-center mb-8">
                Trang Thanh Toán
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card title="Thông tin khách hàng" className="shadow-md">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
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

                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-red-500">
                                    <Text>Tổng cộng:</Text>
                                    <Text>{totalAmount.toLocaleString('vi-VN')} đ</Text>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                    onClick={() => form.submit()}
                                    loading={isLoading}
                                >
                                    Thanh toán thủ công
                                </Button>
                                <Button
                                    type="primary"
                                    className="w-full bg-green-500 hover:bg-green-600"
                                    onClick={() => {
                                        if (!session?.user?.id) {
                                            alert("Vui lòng đăng nhập để thanh toán bằng ví!");
                                            router.push("/dang-nhap");
                                            return;
                                        }
                                        handlePayment(PaymentMethod.THIRD_PARTY);
                                    }}
                                    loading={isLoading}
                                >
                                    Thanh toán bằng ví
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
