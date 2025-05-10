"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import Link from "next/link";
import api from "@/app/services/axiosService";
import { IOrder } from "@/app/interfaces/IOrder";
import { Table, Space, TableProps, Tag, Input, Select, Button, Form } from "antd";
import { toast } from "react-toastify";
import { statusLabels } from "@/app/models/entities/Order";

const { Option } = Select;

const DEFAULT_FILTERS = {
  customerName: "",
  status: "" as "" | "pending" | "completed" | "cancelled",
  minAmount: "",
  maxAmount: "",
  paymentStatus: "" as "" | "unpaid" | "paid",
};

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
  total: 0,
};

export default function Order() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tempFilters, setTempFilters] = useState(DEFAULT_FILTERS); // Trạng thái tạm thời cho bộ lọc
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const fetchOrders = useCallback(
      async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
          const query = new URLSearchParams({
            ...(filters.customerName && { customer_name: filters.customerName }),
            ...(filters.status && { status: filters.status }),
            ...(filters.minAmount && { min_amount: filters.minAmount }),
            ...(filters.maxAmount && { max_amount: filters.maxAmount }),
            ...(filters.paymentStatus && { payment_status: filters.paymentStatus }),
            page: String(page),
            limit: String(pageSize),
          }).toString();

          const { data, status } = await api.get(`/orders?${query}`);

          if (status === 200) {
            setOrders(data.orders || []);
            setPagination((prev) => ({
              ...prev,
              current: page,
              pageSize,
              total: data.pagination.total || 0,
            }));
            setError(false);
          } else {
            setError(true);
            toast.error("Không thể tải danh sách đơn hàng");
          }
        } catch (e) {
          console.error(e);
          setError(true);
          toast.error("Đã xảy ra lỗi khi tải danh sách đơn hàng");
        } finally {
          setLoading(false);
        }
      },
      [filters, pagination.current, pagination.pageSize] // Chỉ phụ thuộc vào filters
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = useCallback((field: keyof typeof tempFilters, value: string) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFilterSubmit = useCallback(() => {
    // Cập nhật filters và reset trang về 1 khi nhấn nút Lọc
    setFilters(tempFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchOrders(1);
  }, [fetchOrders, tempFilters]);

  const handleResetFilters = useCallback(() => {
    setTempFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchOrders(1);
  }, [fetchOrders]);

  const handleTableChange = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ({ current, pageSize }: any) => {
        fetchOrders(current, pageSize);
      },
      [fetchOrders]
  );

  const columns: TableProps<IOrder>["columns"] = useMemo(
      () => [
        {
          title: "STT",
          key: "index",
          render: (_text, _record, index) => index + 1,
          width: 60,
          align: "center",
        },
        {
          title: "Tên Khách Hàng",
          dataIndex: "customer_name",
          key: "customer_name",
        },
        {
          title: "Tổng Tiền",
          dataIndex: "total_amount",
          key: "total_amount",
          render: (amount: number) => `${amount?.toLocaleString("vi-VN")} đ`,
        },
        {
          title: "Trạng Thái",
          dataIndex: "status",
          key: "status",
          render: (status: string) => (
              <Tag
                  color={
                    status === "completed" ? "green" : status === "pending" ? "blue" : "red"
                  }
              >
                {statusLabels[status] || "Không xác định"}
              </Tag>
          ),
        },
        {
          title: "Trạng thái thanh toán",
          dataIndex: "payment_status",
          key: "payment_status",
          render: (payment_status: string) => (
              <Tag color={payment_status === "paid" ? "green" : "red"}>
                {payment_status === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
              </Tag>
          ),
        },
        {
          title: "Hành Động",
          key: "action",
          render: (order) => (
              <Space size="middle">
                <Link href={`/admin/orders/${order.id}`}>
                  <i className="ri-pencil-line"></i>
                </Link>
                <Link href={`/admin/orders/${order.id}`}>
                  <i className="ri-pencil-eye"></i>
                </Link>
              </Space>
          ),
        },
      ],
      []
  );

  if (loading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="title-header option-title d-flex justify-content-between align-items-center">
                <h5>Tất Cả Đơn Hàng</h5>
                <Link href="/admin/orders/create" className="btn btn-theme d-flex align-items-center">
                  Thêm Mới
                </Link>
              </div>

              {/* Filter Form */}
              <Form layout="inline" className="mb-4" onFinish={handleFilterSubmit}>
                <Form.Item label="Tên Khách Hàng">
                  <Input
                      value={tempFilters.customerName}
                      onChange={(e) => handleFilterChange("customerName", e.target.value)}
                      placeholder="Nhập tên khách hàng"
                  />
                </Form.Item>
                <Form.Item label="Trạng Thái">
                  <Select
                      value={tempFilters.status}
                      onChange={(value) => handleFilterChange("status", value)}
                      style={{ width: 120 }}
                  >
                    <Option value="">Tất cả</Option>
                      <Option value="pending">Chờ xử lý</Option>
                      <Option value="processing">Đang bàn giao nick</Option>
                      <Option value="completed">Đã bàn giao nick</Option>
                      <Option value="cancelled">Đã hủy</Option>
                      <Option value="failed">Có lỗi</Option>
                  </Select>
                </Form.Item>
                {/*<Form.Item*/}
                {/*    label="Giá từ"*/}
                {/*    validateStatus={tempFilters.minAmount && Number(tempFilters.minAmount) < 0 ? "error" : ""}*/}
                {/*    help={tempFilters.minAmount && Number(tempFilters.minAmount) < 0 ? "Phải là số dương" : ""}*/}
                {/*>*/}
                {/*  <Input*/}
                {/*      type="number"*/}
                {/*      value={tempFilters.minAmount}*/}
                {/*      onChange={(e) => handleFilterChange("minAmount", e.target.value)}*/}
                {/*      placeholder="Min"*/}
                {/*      min={0}*/}
                {/*  />*/}
                {/*</Form.Item>*/}
                {/*<Form.Item*/}
                {/*    label="Đến"*/}
                {/*    validateStatus={*/}
                {/*      tempFilters.maxAmount &&*/}
                {/*      (Number(tempFilters.maxAmount) < 0 || Number(tempFilters.maxAmount) < Number(tempFilters.minAmount))*/}
                {/*          ? "error"*/}
                {/*          : ""*/}
                {/*    }*/}
                {/*    help={*/}
                {/*        tempFilters.maxAmount &&*/}
                {/*        (Number(tempFilters.maxAmount) < 0*/}
                {/*            ? "Phải là số dương"*/}
                {/*            : Number(tempFilters.maxAmount) < Number(tempFilters.minAmount)*/}
                {/*                ? "Phải lớn hơn Giá từ"*/}
                {/*                : "")*/}
                {/*    }*/}
                {/*>*/}
                {/*  <Input*/}
                {/*      type="number"*/}
                {/*      value={tempFilters.maxAmount}*/}
                {/*      onChange={(e) => handleFilterChange("maxAmount", e.target.value)}*/}
                {/*      placeholder="Max"*/}
                {/*      min={tempFilters.minAmount || 0}*/}
                {/*  />*/}
                {/*</Form.Item>*/}
                <Form.Item label="Trạng Thái Thanh Toán">
                  <Select
                      value={tempFilters.paymentStatus}
                      onChange={(value) => handleFilterChange("paymentStatus", value)}
                      style={{ width: 120 }}
                  >
                    <Option value="">Tất cả</Option>
                    <Option value="unpaid">Chưa thanh toán</Option>
                    <Option value="paid">Đã thanh toán</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    Lọc
                  </Button>
                  <Button className="ml-2" onClick={handleResetFilters} disabled={loading}>
                    Reset
                  </Button>
                </Form.Item>
              </Form>

              <div className="table-responsive order-table">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    bordered
                    pagination={{
                      current: pagination.current,
                      pageSize: pagination.pageSize,
                      total: pagination.total,
                      showSizeChanger: true,
                      pageSizeOptions: ["10", "20", "50", "100"],
                      onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                    }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}