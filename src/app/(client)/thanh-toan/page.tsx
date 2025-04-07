"use client"
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CheckoutFormValues {
    name: string;
    phone: string;
    address: string;
    email: string;
}

const { Title, Text } = Typography;

export default function CheckoutPage() {
    const [form] = Form.useForm<CheckoutFormValues>();

    // const cartItems: CartItem[] = [
    //     { id: 1, name: 'Sản phẩm 1', price: 200000, quantity: 2 },
    //     { id: 2, name: 'Sản phẩm 2', price: 150000, quantity: 1 },
    // ];
    const getCartItems = (): CartItem[] => {
        const storedItems = localStorage.getItem('cartItems');
        return storedItems ? JSON.parse(storedItems) : [];
    };
    
    const cartItems: CartItem[] = getCartItems();
    console.log(cartItems);
    const totalAmount: number = cartItems.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
    );

    const onFinish = (values: CheckoutFormValues) => {
        console.log('Thông tin thanh toán:', values);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 px-4">
            <Title level={2} className="text-center mb-8">
                Trang Thanh Toán
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card title="Thông tin giao hàng" className="shadow-md">
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
                                <Input
                                    className="w-full"
                                    placeholder="Nhập họ và tên"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    className="w-full"
                                    placeholder="Nhập số điện thoại"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                            >
                                <Input.TextArea
                                    rows={3}
                                    className="w-full"
                                    placeholder="Nhập địa chỉ giao hàng"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' }
                                ]}
                            >
                                <Input
                                    className="w-full"
                                    placeholder="Nhập email"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                >
                                    Xác nhận thanh toán
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Thông tin đơn hàng */}
                <Col xs={24} md={8}>
                    <Card title="Đơn hàng của bạn" className="shadow-md">
                        <div className="space-y-4">
                            {cartItems.map((item: CartItem) => (
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
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}