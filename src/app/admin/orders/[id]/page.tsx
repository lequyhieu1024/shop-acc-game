"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Descriptions, Tag, Button, Form, Select, Table } from "antd";
import api from "@/app/services/axiosService";
import { IOrder } from "@/app/interfaces/IOrder";
import Loading from "@/components/Loading";
import { statusLabels } from "@/app/models/entities/Order";
import { toast } from "react-toastify";
import {number_format} from "@/app/services/commonService";

const { Option } = Select;

export default function EditOrder() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${params.id}`);
        const formattedData = {
          ...data,
          created_at: data.created_at ? new Date(data.created_at).toLocaleString("vi-VN") : "N/A",
          updated_at: data.updated_at ? new Date(data.updated_at).toLocaleString("vi-VN") : "N/A",
        };
        setOrder(formattedData);
        setStatus(formattedData.status || "pending");
        setPaymentStatus(formattedData.payment_status || "unpaid");
      } catch (e) {
        console.log((e as Error).message);
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/orders/${params.id}`, {
        status
      });
      toast.success("Cập nhật trạng thái đơn hàng thành công");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Cập nhật trạng thái đơn hàng thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (product: any) => (
          <div className="flex items-center gap-2">
            <img style={{ width: 200, height: 100 }}
                src={String(product!.thumbnail) || "/placeholder-image.jpg"}
                alt={product!.name || "Hình ảnh sản phẩm"}
                className="w-12 h-12 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.jpg";
                }}
            />
            <div>
              <div className="font-medium">{product!.name || "N/A"}</div>
              <div className="text-sm text-gray-500">
                {product?.category.name || "Không có danh mục"}
              </div>
            </div>
          </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (unit_price: number) => (unit_price ? `${number_format(unit_price)} đ` : "N/A"),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => quantity || "N/A",
    },
    {
      title: "Thành tiền",
      key: "total_price",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (record: any) => {
        const totalPrice = record.unit_price && record.quantity ? record.unit_price * record.quantity : null;
        return totalPrice + ' đ';
      },
    },
  ];

  if (loading) return <Loading />;
  if (!order) return <div className="text-center text-red-500">Không tìm thấy đơn hàng</div>;

  return (
      <Card
          className="overflow-x-auto"
          title="Chi tiết thông tin đơn hàng"
          extra={<Button onClick={() => router.push("/admin/orders")}>Quay lại</Button>}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã đơn hàng">{order.id || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{String(order.created_at) || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Tên khách hàng">{order.customer_name || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.customer_email || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.customer_phone || "N/A"}</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            Ví
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            <Tag color={order.payment_status === "paid" ? "green" : "red"}>
              {order.payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái đơn hàng">
            <Tag
                color={
                  order.status === "completed"
                      ? "green"
                      : order.status === "processing"
                          ? "blue"
                          : order.status === "cancelled"
                              ? "red"
                              : "orange"
                }
            >
              {statusLabels[order.status] || order.status || "N/A"}
            </Tag>
          </Descriptions.Item>
          {
            order.voucher ? (
                <>
                  <Descriptions.Item label="Tổng giá sản phẩm">
                    <span className="text-lg font-bold text-red-500">
                      {order.total_product_price?.toLocaleString("vi-VN") || "0"} đ
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giảm trừ từ mã giảm giá">
                    <span className="text-lg font-bold text-red-500">
                      {order.voucher_discount?.toLocaleString("vi-VN") || "0"} đ
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng thanh toán">
                    <span className="text-lg font-bold text-red-500">
                      {order.total_amount?.toLocaleString("vi-VN") || "0"} đ
                    </span>
                  </Descriptions.Item>
                </>
              ) : (
                    <Descriptions.Item label="Tổng thanh toán">
                        <span className="text-lg font-bold text-red-500">
                          {order.total_amount?.toLocaleString("vi-VN") || "0"} đ
                        </span>
                    </Descriptions.Item>
              )
          }
        </Descriptions>

        <div className="mt-5">
          <h3 className="text-lg font-medium mb-4">Danh sách sản phẩm</h3>
          <Table
              columns={columns}
              dataSource={order.items || []}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: "Không có sản phẩm nào" }}
              className="custom-table"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-medium mb-4">Cập nhật trạng thái</h3>
          <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ status, payment_status: paymentStatus }}
          >
            <Form.Item
                label="Trạng thái đơn hàng"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select value={status} onChange={setStatus}>
                <Option value="pending">Chờ xử lý</Option>
                <Option value="processing">Đang bàn giao nick</Option>
                <Option value="completed">Đã bàn giao nick</Option>
                <Option value="cancelled">Đã hủy</Option>
                <Option value="failed">Có lỗi</Option>
              </Select>
            </Form.Item>

            <Form.Item
                label="Trạng thái thanh toán"
                name="payment_status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán" }]}
            >
              <Select disabled={true} value={paymentStatus} onChange={setPaymentStatus}>
                <Option value="unpaid">Chưa thanh toán</Option>
                <Option value="paid">Đã thanh toán</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <div className="flex gap-2">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                </Button>
                <Button onClick={() => router.push("/admin/orders")}>Quay lại</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Card>
  );
}