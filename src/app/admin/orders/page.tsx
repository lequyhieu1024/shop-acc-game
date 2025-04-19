"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import Link from "next/link";
import api from "@/app/services/axiosService";
import { IOrder } from "@/app/interfaces/IOrder";
import { Table, Space, TableProps, Tag, Input, Select, Button, Form } from "antd";
import { toast } from "react-toastify";
import DeleteConfirm from "@/components/DeleteConfirm";

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
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const fetchOrders = useCallback(async (page = pagination.current, pageSize = pagination.pageSize) => {
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

      const { data, status } = await api.get(`orders?${query}`);

      if (status === 200) {
        setOrders(data.orders || []);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize,
          total: data.pagination.total,
        }));
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onDelete = useCallback(async (id: number) => {
    try {
      await api.delete(`orders/${id}`);
      toast.success("Xóa đơn hàng thành công");
      await fetchOrders();
    } catch (e) {
      setError(true);
      console.error((e as Error).message);
    }
  }, [fetchOrders]);

  const handleFilterChange = useCallback((field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFilterSubmit = useCallback(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchOrders(1);
  }, [fetchOrders]);

  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchOrders(1);
  }, [fetchOrders]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = useCallback(({ current, pageSize }: any) => {
    fetchOrders(current, pageSize);
  }, [fetchOrders]);

  const columns: TableProps<IOrder>["columns"] = useMemo(() => [
    {
      title: "STT",
      key: "index",
      render: (_text, _record, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Mã Đơn Hàng",
      dataIndex: "id",
      key: "id",
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
        <Tag color={status === "completed" ? "green" : status === "pending" ? "blue" : "red"}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (order) => (
        <Space size="middle">
          <Link href={`/admin/orders/${order.id}`}>
            <i className="ri-pencil-line"></i>
          </Link>
          <DeleteConfirm onConfirm={() => onDelete(order.id)} />
        </Space>
      ),
    },
  ], [onDelete]);

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
                  value={filters.customerName}
                  onChange={(e) => handleFilterChange("customerName", e.target.value)}
                  placeholder="Nhập tên khách hàng"
                />
              </Form.Item>
              <Form.Item label="Trạng Thái">
                <Select
                  value={filters.status}
                  onChange={(value) => handleFilterChange("status", value)}
                  style={{ width: 120 }}
                >
                  <Option value="">Tất cả</Option>
                  <Option value="pending">Đang chờ</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Giá từ">
                <Input
                  type="number"
                  value={filters.minAmount}
                  onChange={(e) => handleFilterChange("minAmount", e.target.value)}
                  placeholder="Min"
                />
              </Form.Item>
              <Form.Item label="Đến">
                <Input
                  type="number"
                  value={filters.maxAmount}
                  onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
                  placeholder="Max"
                />
              </Form.Item>
              <Form.Item label="Trạng Thái Thanh Toán">
                <Select
                  value={filters.paymentStatus}
                  onChange={(value) => handleFilterChange("paymentStatus", value)}
                  style={{ width: 120 }}
                >
                  <Option value="">Tất cả</Option>
                  <Option value="unpaid">Chưa thanh toán</Option>
                  <Option value="paid">Đã thanh toán</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Lọc
                </Button>
                <Button className="ml-2" onClick={handleResetFilters}>
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
