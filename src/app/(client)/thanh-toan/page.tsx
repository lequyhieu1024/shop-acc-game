"use client";
import { Form, Input, Button, Card, Row, Col, Typography, Select } from "antd";
import { useEffect, useState } from "react";
import MethodPayment from "./MethodPayment";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/app/services/axiosService";
import { PaymentMethod, PaymentStatus } from "@/app/models/entities/Order";
import { toast } from "react-toastify";
import {convertToInt} from "@/app/helpers/common";

interface CartItem {
    id: number;
    name: string;
    sale_price: number;
    regular_price: number;
    quantity: number;
}

interface CheckoutFormValues {
    name: string;
    phone: string;
    email: string;
    voucherCode?: string;
}

const { Title, Text } = Typography;
const { Option } = Select;

export default function CheckoutPage() {
    const [form] = Form.useForm<CheckoutFormValues>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isWebPurchaseLoading, setIsWebPurchaseLoading] = useState(false);
    const [isAdminPurchaseLoading, setIsAdminPurchaseLoading] = useState(false);
    const [voucherDiscount, setVoucherDiscount] = useState(0);
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [isAppliedVoucher, setIsAppliedVoucher] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"ATM" | "CARD">("CARD");
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedItems = localStorage.getItem("cartItems");
            setCartItems(storedItems ? JSON.parse(storedItems) : []);
        }
    }, []);

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + (paymentMethod === "ATM" ? item.sale_price : item.regular_price) * item.quantity,
        0
    );

    const finalAmount = totalAmount - voucherDiscount;

    const handleApplyVoucher = async () => {
        const voucherCode = form.getFieldValue("voucherCode");
        if (!voucherCode) {
            toast.error("Vui lòng nhập mã giảm giá!");
            return;
        }

        try {
            setIsApplyingVoucher(true);
            const voucherResponse = await api.post("/vouchers/validate", {
                code: voucherCode,
                amount: totalAmount,
            });

            if (voucherResponse.data.result) {
                const discount = voucherResponse.data.discount || 0;
                setVoucherDiscount(discount);
                setIsAppliedVoucher(true);
                toast.success(`Áp dụng mã giảm giá thành công! Giảm ${discount.toLocaleString("vi-VN")} đ`);
            } else {
                setVoucherDiscount(0);
                setIsAppliedVoucher(false);
                toast.error(`${voucherResponse.data.message}`);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setVoucherDiscount(0);
            setIsAppliedVoucher(false);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`${error.response.data.message}`);
            } else {
                console.error("Error applying voucher:", error.message);
                toast.error("Có lỗi khi áp dụng mã giảm giá!");
            }
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const handleRemoveVoucher = () => {
        setVoucherDiscount(0);
        setIsAppliedVoucher(false);
        form.setFieldsValue({ voucherCode: "" });
        form.resetFields(["voucherCode"]);
        toast.info("Đã xóa mã giảm giá!");
    };

    const handleWebPurchase = async () => {
        if (!session?.user?.id) {
            toast.error("Vui lòng đăng nhập để mua nick!");
            router.push("/dang-nhap");
            return;
        }

        try {
            setIsWebPurchaseLoading(true);
            const values = await form.validateFields();

            const balanceResponse = await api.get("/user/balance");
            const userBalance = balanceResponse.data.balance;

            if (userBalance < finalAmount) {
                toast.error(
                    `Số dư không đủ! Số dư hiện tại: ${userBalance.toLocaleString(
                        "vi-VN"
                    )} đ, Số tiền cần thanh toán: ${finalAmount.toLocaleString("vi-VN")} đ`
                );
                return;
            }

            for (const item of cartItems) {
                const productResponse = await api.get(`/products/${item.id}`);
                if (productResponse.data.quantity < item.quantity) {
                    toast.error(
                        `Sản phẩm ${item.name} chỉ còn ${productResponse.data.quantity} sản phẩm, không đủ số lượng bạn yêu cầu.`
                    );
                    return;
                }
            }

            await api.post("/orders", {
                user_id: session.user.id,
                customer_name: values.name,
                customer_email: values.email,
                customer_phone: values.phone,
                total_amount: finalAmount,
                voucher_code: values.voucherCode,
                payment_method: paymentMethod === "ATM" ? PaymentMethod.BANK_TRANSFER : PaymentMethod.THIRD_PARTY,
                payment_status: PaymentStatus.PAID,
                order_items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: paymentMethod === "ATM" ? item.sale_price : item.regular_price,
                })),
            });

            setCartItems([]);
            localStorage.removeItem("cartItems");
            localStorage.removeItem("totalItems");

            toast.success(
                "Đặt hàng thành công!",
                {
                    onClose: () => window.location.href = "/don-hang-cua-toi",
                    autoClose: 3000,
                }
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error during purchase:", error);
            let errorMessage = "Có lỗi xảy ra khi xử lý thanh toán";
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

    const handlePaymentMethodChange = (value: "ATM" | "CARD") => {
        setPaymentMethod(value);
        if (isAppliedVoucher) {
            handleApplyVoucher();
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-16 p-4">
            <Title level={2} className="text-center mb-8">
                Trang Thanh Toán
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card title="Thông tin khách hàng" className="shadow-md">
                        <Form form={form} layout="vertical" className="space-y-4">
                            <Form.Item
                                label="Họ và tên"
                                name="name"
                                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
                            >
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email!" },
                                    { type: "email", message: "Email không hợp lệ!" },
                                ]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>

                            <Form.Item label="Mã giảm giá (nếu có)" name="voucherCode">
                                <div className="flex gap-2">
                                    <Input placeholder="Nhập mã giảm giá" />
                                    <Button
                                        type={isAppliedVoucher ? "default" : "primary"}
                                        onClick={isAppliedVoucher ? handleRemoveVoucher : handleApplyVoucher}
                                        loading={isApplyingVoucher}
                                    >
                                        {isAppliedVoucher ? "Hủy" : "Áp dụng"}
                                    </Button>
                                </div>
                            </Form.Item>

                            <Form.Item
                                label="Phương thức thanh toán"
                                name="payment_method"
                                rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
                            >
                                <Select
                                    onChange={handlePaymentMethodChange}
                                    placeholder="--Chọn phương thức thanh toán--"
                                >
                                    <Select.Option value="CARD">Card</Select.Option>
                                    <Select.Option value="ATM">ATM</Select.Option>
                                </Select>
                            </Form.Item>
                            {paymentMethod === "ATM" && (
                                <Text className="text-red-500 mt-3">
                                    Đối với thanh toán bằng ATM, vui lòng chuyển khoản vào TK ngân hàng bên dưới, chụp lại màn hình và liên hệ quản trị viên để nhận acc<br />
                                    Ngân hàng: MB Bank<br />
                                    STK: 8890125068888<br />
                                    Chủ tài khoản: Phạm Văn Hùng
                                </Text>
                            )}
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="Đơn hàng của bạn" className="shadow-md">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <Text className="font-medium">
                                        {item.name} x {item.quantity}
                                    </Text>
                                    <Text className="font-medium text-red-500">
                                        {(paymentMethod === "ATM" ? item.sale_price : item.regular_price) * Number(convertToInt(item.quantity))} đ
                                    </Text>
                                </div>
                            ))}

                            <div className="border-t pt-4">
                                <div className="flex justify-between">
                                    <Text>Tổng tiền trước giảm:</Text>
                                    <Text>{convertToInt(totalAmount)} đ</Text>
                                </div>
                                {voucherDiscount > 0 && (
                                    <div className="flex justify-between text-green-500">
                                        <Text>Giảm giá:</Text>
                                        <Text>-{convertToInt(voucherDiscount)} đ</Text>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-red-500">
                                    <Text>Tổng tiền sau giảm:</Text>
                                    <Text>{convertToInt(finalAmount)} đ</Text>
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