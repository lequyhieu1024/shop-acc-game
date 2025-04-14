"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { IOrder, IOrderItem } from "@/app/interfaces/IOrder";
import { IProduct } from "@/app/interfaces/IProduct";
import api from "@/app/services/axiosService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OrderStatus, PaymentMethod, PaymentStatus } from "@/app/models/entities/Order";
import { Form, Input, Button, Select, InputNumber, Table, Row, Col } from "antd";
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";

interface OrderFormProps {
  isEditing?: boolean;
  initialData?: IOrder | null;
}

export default function OrderForm({
  isEditing = false,
  initialData = null,
}: OrderFormProps) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const keyCounterRef = useRef<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await api.get("products/get-list");
        if (response.status === 200) {
          const data = Array.isArray(response.data.products) ? response.data?.products : [];
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách sản phẩm");
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const generateKey = useCallback(() => {
    const key = `item_${keyCounterRef.current}`;
    keyCounterRef.current += 1;
    return key;
  }, []);

  const getInitialOrderItems = useCallback(() => {
    if (initialData?.order_items?.length) {
      return initialData.order_items.map((item, index) => ({
        ...item,
        key: `existing_${index}`,
      }));
    }
    return [{ key: generateKey(), quantity: 1, unit_price: 0, line_total: 0 }];
  }, [initialData, generateKey]);

  const handleSubmit = useCallback(
    async (values: any) => {
      setLoading(true);
      try {
        const orders = values.orders.map((order: any) => {
          const orderItems = order.order_items
            .filter((item: IOrderItem) => item.product_id)
            .map(({ key, ...item }: IOrderItem) => ({
              ...item,
              total_amount: item.quantity * item.unit_price,
            }));

          if (!orderItems.length) {
            throw new Error("Đơn hàng phải có ít nhất một sản phẩm");
          }

          if (!order.customer_name || !order.customer_email || !order.customer_phone) {
            throw new Error("Thông tin khách hàng không đầy đủ");
          }

          return {
            customer_name: order.customer_name,
            customer_email: order.customer_email,
            customer_phone: order.customer_phone,
            order_items: orderItems,
            status: order.status,
            payment_method: order.payment_method,
            payment_status: order.payment_status,
            total_amount: orderItems.reduce(
              (sum: number, item: any) => sum + item.total_amount,
              0
            ),
          };
        });

        const response = await api.post("/orders", orders);

        if (response.status === 200) {
          toast.success("Thêm đơn hàng thành công");
          router.push("/admin/orders");
        }
      } catch (error: any) {
        setError(true);
        toast.error(error.message || "Có lỗi xảy ra khi gửi dữ liệu");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const updateOrderTotal = useCallback(
    (orderIndex: number) => {
      const orderItems = form.getFieldValue(["orders", orderIndex, "order_items"]) || [];
      const total = orderItems.reduce(
        (sum: number, item: IOrderItem) =>
          sum + (item.quantity || 0) * (item.unit_price || 0),
        0
      );

      form.setFieldsValue({
        orders: {
          [orderIndex]: { total_amount: total },
        },
      });

      return total;
    },
    [form]
  );

  const handleProductChange = useCallback(
    (value: number, orderIndex: number, itemIndex: number) => {
      const selectedProduct = products.find((product) => product.id === value);
      if (selectedProduct) {
        const currentItems =
          form.getFieldValue(["orders", orderIndex, "order_items"]) || [];
        const quantity = currentItems[itemIndex]?.quantity || 1;

        currentItems[itemIndex] = {
          ...currentItems[itemIndex],
          product_id: value,
          product_name: selectedProduct.name,
          unit_price: selectedProduct.sale_price,
          line_total: quantity * selectedProduct.sale_price,
        };

        form.setFieldsValue({
          orders: { [orderIndex]: { order_items: currentItems } },
        });

        updateOrderTotal(orderIndex);
      }
    },
    [form, products, updateOrderTotal]
  );

  const handleQuantityChange = useCallback(
    (value: number | null, orderIndex: number, itemIndex: number) => {
      if (value === null) return;
      const currentItems =
        form.getFieldValue(["orders", orderIndex, "order_items"]) || [];
      const unitPrice = currentItems[itemIndex]?.unit_price || 0;

      currentItems[itemIndex] = {
        ...currentItems[itemIndex],
        quantity: value,
        line_total: value * unitPrice,
      };

      form.setFieldsValue({
        orders: { [orderIndex]: { order_items: currentItems } },
      });

      updateOrderTotal(orderIndex);
    },
    [form, updateOrderTotal]
  );

  const addProductLine = useCallback(
    (orderIndex: number) => {
      const currentItems =
        form.getFieldValue(["orders", orderIndex, "order_items"]) || [];
      const newItems = [
        ...currentItems,
        {
          key: generateKey(),
          product_id: undefined,
          quantity: 1,
          unit_price: 0,
          line_total: 0,
        },
      ];

      form.setFieldsValue({
        orders: { [orderIndex]: { order_items: newItems } },
      });
    },
    [form, generateKey]
  );

  const removeProductLine = useCallback(
    (orderIndex: number, itemIndex: number) => {
      const currentItems =
        form.getFieldValue(["orders", orderIndex, "order_items"]) || [];
      const newItems = currentItems.filter((_: any, index: number) => index !== itemIndex);

      form.setFieldsValue({
        orders: { [orderIndex]: { order_items: newItems } },
      });

      updateOrderTotal(orderIndex);
    },
    [form, updateOrderTotal]
  );

  const tableColumns = useMemo(
    () => [
      {
        title: "STT",
        width: 60,
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: "Sản phẩm",
        dataIndex: "product_id",
        key: "product_id",
        width: 300,
        render: (_: any, __: any, index: number) => (
          <Form.Item
            name={[index, "product_id"]}
            rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}
            noStyle
          >
            <Select
              placeholder="Chọn sản phẩm"
              style={{ width: "100%" }}
              onChange={(value: number) => handleProductChange(value, 0, index)}
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
              disabled={productsLoading || !products.length}
            />
          </Form.Item>
        ),
      },
      {
        title: "Số lượng",
        dataIndex: "quantity",
        key: "quantity",
        width: 120,
        render: (_: any, __: any, index: number) => (
          <Form.Item
            name={[index, "quantity"]}
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
            noStyle
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              onChange={(value: number | null) => handleQuantityChange(value, 0, index)}
            />
          </Form.Item>
        ),
      },
      {
        title: "Đơn giá",
        dataIndex: "unit_price",
        key: "unit_price",
        width: 150,
        render: (_: any, __: any, index: number) => (
          <Form.Item name={[index, "unit_price"]} noStyle>
            <InputNumber
              disabled
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ),
      },
      {
        title: "Thành tiền",
        dataIndex: "line_total",
        key: "line_total",
        width: 150,
        render: (_: any, __: any, index: number) => (
          <Form.Item name={[index, "line_total"]} noStyle>
            <InputNumber
              disabled
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        ),
      },
      {
        title: "Thao tác",
        key: "action",
        width: 100,
        render: (_: any, __: any, index: number) => (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeProductLine(0, index)}
            disabled={form.getFieldValue(["orders", 0, "order_items"])?.length === 1}
          />
        ),
      },
    ],
    [products, productsLoading, handleProductChange, handleQuantityChange, removeProductLine, form]
  );

  return loading ? (
    <div className="text-center">Loading...</div>
  ) : error ? (
    <div className="text-center text-red-500">Error loading the form</div>
  ) : (
    <Form
      form={form}
      name="order_form"
      onFinish={handleSubmit}
      initialValues={{
        orders: [
          {
            customer_id: undefined,
            order_items: getInitialOrderItems(),
            status: OrderStatus.PENDING,
            payment_method: PaymentMethod.CASH,
            payment_status: PaymentStatus.UNPAID,
          },
        ],
      }}
      layout="vertical"
      className="space-y-6 p-6 bg-white shadow-lg rounded-md"
    >
      <Form.List name="orders">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name: orderIndex, ...restField }) => (
              <div key={key} className="order-item space-y-4 p-4 border rounded-md">
                <h4 className="text-[20px] py-4" style={{ fontWeight: 700 }}>
                  {isEditing ? "Chỉnh sửa đơn hàng" : "Tạo mới đơn hàng"}
                </h4>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[orderIndex, "customer_name"]}
                      label="Tên khách hàng"
                      rules={[{ required: true, message: "Tên khách hàng không được để trống" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[orderIndex, "customer_email"]}
                      label="Email"
                      rules={[
                        { required: true, message: "Email không được để trống" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[orderIndex, "customer_phone"]}
                      label="Số điện thoại"
                      rules={[{ required: true, message: "Số điện thoại không được để trống" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <h5 className="text-[16px] py-2" style={{ fontWeight: 600 }}>
                  Danh sách sản phẩm
                </h5>

                <Form.List name={[orderIndex, "order_items"]}>
                  {(productFields, { add: addProduct }) => (
                    <Table
                      dataSource={
                        form.getFieldValue(["orders", orderIndex, "order_items"]) || []
                      }
                      pagination={false}
                      rowKey={(record) => record.key}
                      columns={tableColumns}
                      footer={() => (
                        <Button
                          type="dashed"
                          onClick={() => addProductLine(orderIndex)}
                          block
                          icon={<PlusOutlined />}
                          disabled={productsLoading || !products.length}
                        >
                          Thêm sản phẩm
                        </Button>
                      )}
                    />
                  )}
                </Form.List>

                <Row justify="end">
                  <Col span={8}>
                    <Form.Item
                      label="Tổng tiền đơn hàng"
                      name={[orderIndex, "total_amount"]}
                    >
                      <InputNumber
                        disabled
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[orderIndex, "status"]}
                      label="Trạng thái"
                      rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                    >
                      <Select>
                        <Select.Option value={OrderStatus.PENDING}>Đang chờ</Select.Option>
                        <Select.Option value={OrderStatus.COMPLETED}>Hoàn thành</Select.Option>
                        <Select.Option value={OrderStatus.CANCELLED}>Đã hủy</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[orderIndex, "payment_method"]}
                      label="Phương thức thanh toán"
                      rules={[
                        { required: true, message: "Vui lòng chọn phương thức thanh toán" },
                      ]}
                    >
                      <Select>
                        <Select.Option value={PaymentMethod.CASH}>Tiền mặt</Select.Option>
                        <Select.Option value={PaymentMethod.BANK_TRANSFER}>
                          Chuyển khoản
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  {...restField}
                  name={[orderIndex, "payment_status"]}
                  label="Trạng thái thanh toán"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán" }]}
                >
                  <Select>
                    <Select.Option value={PaymentStatus.PAID}>Đã thanh toán</Select.Option>
                    <Select.Option value={PaymentStatus.UNPAID}>Chưa thanh toán</Select.Option>
                  </Select>
                </Form.Item>

                {fields.length > 1 && (
                  <Button
                    danger
                    type="dashed"
                    icon={<MinusCircleOutlined />}
                    onClick={() => remove(orderIndex)}
                  >
                    Xóa đơn hàng
                  </Button>
                )}
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() =>
                  add({
                    order_items: [{ key: generateKey(), quantity: 1, unit_price: 0, line_total: 0 }],
                  })
                }
                block
              >
                Thêm đơn hàng
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div className=" flex justify-between gap-3 flex-col p-3" style={{display:"flex",alignItems:"center"}}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Lưu
        </Button>
        <Link href="/admin/orders" className="text-blue-500 hover:underline">
          Trở lại
        </Link>
      </div>
    </Form>
  );
}