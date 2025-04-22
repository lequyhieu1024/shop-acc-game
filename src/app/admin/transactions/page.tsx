"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ITransaction } from "@/app/interfaces/ITransaction";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import { Space, Table, TableProps, Tag } from "antd";
import { CardStatus } from "@/app/models/entities/CardTransaction";
import { Timestamp } from "typeorm";

interface Filters {
  [key: string]: string | number | boolean;
}

export default function Transaction() {
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [formData, setFormData] = useState({
    user_code: "",
    status: "",
    request_id: "", // Thay value thành request_id
    created_at: "",
  });

  const fetchTransactions = async (
      filters: Filters = formData,
      page: number = pagination.current,
      size: number = pagination.pageSize
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get(`transactions?${params.toString()}`);

      if (response.status === 200) {
        const mappedTransactions: ITransaction[] = response.data.transactions.map(
            (trans: any) => ({
              ...trans,
              id: Number(trans.id),
              user_id: Number(trans.user_id),
              request_id: Number(trans.request_id),
              status: trans.status.toString() as CardStatus,
              amount: Number(trans.amount),
              declared_value: trans.declared_value ? Number(trans.declared_value) : null,
              value: trans.value ? Number(trans.value) : null,
              trans_id: trans.trans_id ? Number(trans.trans_id) : null,
              created_at: trans.created_at, // Timestamp sẽ được xử lý khi hiển thị
              user_code: trans.user_code, // Đảm bảo user_code được lấy từ API
            })
        );
        setTransactions(mappedTransactions || []);
        setPagination({
          current: page,
          pageSize: size,
          total: response.data.pagination.total,
        });
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
  };

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchTransactions(formData, 1);
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData({
      user_code: "",
      status: "",
      request_id: "", // Thay value thành request_id
      created_at: "",
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchTransactions({
      user_code: "",
      status: "",
      request_id: "",
      created_at: "",
    });
  };

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    fetchTransactions(formData, current, pageSize);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns: TableProps<ITransaction>["columns"] = [
    {
      title: "Mã yêu cầu",
      dataIndex: "request_id",
      key: "request_id",
    },
    {
      title: "Mã người dùng",
      dataIndex: "user_code",
      key: "user_code",
      // render: (user_code: string | undefined) => user_code || "-",
    },
    {
      title: "Nhà mạng",
      dataIndex: "telco",
      key: "telco",
    },
    {
      title: "Giá trị thẻ khai báo",
      dataIndex: "declared_value",
      key: "declared_value",
      render: (value: number | null) =>
          value ? `${value.toLocaleString()} VND` : "-",
    },
    {
      title: "Giá trị thực của thẻ",
      dataIndex: "value",
      key: "value",
      render: (value: number | null) =>
          value ? `${value.toLocaleString()} VND` : "-",
    },
    {
      title: "Số tiền thực nhận",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: CardStatus) => {
        const statusMap: Record<CardStatus, { label: string; color: string }> = {
          "1": { label: "SUCCESS_CORRECT", color: "green" },
          "2": { label: "SUCCESS_INCORRECT", color: "blue" },
          "3": { label: "FAILED", color: "red" },
          "4": { label: "MAINTENANCE", color: "orange" },
          "99": { label: "PENDING", color: "gold" },
          "100": { label: "SUBMIT_FAILED", color: "purple" },
        };
        const { label, color } = statusMap[status] || {
          label: "Không xác định",
          color: "gray",
        };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: Timestamp) => new Date(created_at.toString()).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (transaction: ITransaction) => (
          <Space size="middle">
            <Link href={`/admin/transactions/${transaction.id}`}>
              <i className="ri-eye-line"></i>
            </Link>
          </Space>
      ),
    },
  ];

  return loading ? (
      <Loading />
  ) : error ? (
      <ErrorPage />
  ) : (
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-table">
            <div className="card-body">
              <div className="title-header option-title">
                <h5>Danh sách giao dịch</h5>
              </div>
              <div>
                <div className="table-responsive">
                  <div id="table_id_wrapper" className="dataTables_wrapper no-footer">
                    <div>
                      <form onSubmit={handleSearch} className="mb-3">
                        <div className="row g-3">
                          <div className="col-md-3">
                            <input
                                type="text"
                                name="user_code"
                                className="form-control"
                                placeholder="Mã người dùng"
                                value={formData.user_code}
                                onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <select
                                name="status"
                                className="form-select form-control"
                                value={formData.status}
                                onChange={handleChange}
                            >
                              <option value="">Trạng thái</option>
                              <option value="99">Đang chờ</option>
                              <option value="1">Thành công (đúng mệnh giá)</option>
                              <option value="2">Thành công (sai mệnh giá)</option>
                              <option value="3">Thất bại</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <input
                                type="number"
                                name="request_id" // Thay value thành request_id
                                className="form-control"
                                placeholder="Mã yêu cầu"
                                value={formData.request_id}
                                onChange={handleChange}
                            />
                          </div>
                          <div className="col-md-3">
                            <input
                                type="date"
                                name="created_at"
                                className="form-control"
                                value={formData.created_at}
                                onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="mt-3 d-flex gap-2">
                          <button type="submit" className="btn btn-primary btn-lg">
                            <i className="fa fa-search"></i>
                          </button>
                          <button
                              type="button"
                              className="btn btn-info btn-lg"
                              onClick={handleReset}
                          >
                            <i className="fa fa-history"></i>
                          </button>
                        </div>
                      </form>

                      <Table
                          columns={columns}
                          className="theme-table"
                          bordered
                          dataSource={transactions.map((transaction) => ({
                            ...transaction,
                            key: transaction.id.toString(),
                          }))}
                          locale={{ emptyText: "Không có dữ liệu" }}
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
          </div>
        </div>
      </div>
  );
}