"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ITransaction } from "@/app/interfaces/ITransaction";
import api from "@/app/services/axiosService";
import Loading from "@/components/Loading";
import ErrorPage from "@/components/(admin)/Error";
import { Space, Table, TableProps, Tag } from "antd";
import { CardStatus } from "@/app/models/entities/CardTransaction";
interface Filters {
  [key: string]: string | number | boolean;
}
export default function Transaction() {
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [error, setError] = useState<boolean>(false);
  const fetchTransactions = async (
    filters: Filters = {},
    size: number = 20,
    page: number = 1
  ) => {
    try {
      const params = new URLSearchParams({
        size: size.toString(),
        page: page.toString()
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const response = await api.get(`transactions?${params.toString()}`);

      if (response.status === 200) {
        setTransactions(response.data.transactions || []);
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

  const [formData, setFormData] = useState({
    user_code: "",
    status: "",
    value: "",
    created_at: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e: React.MouseEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    fetchTransactions(formData);
  };

  const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormData({
      user_code: "",
      status: "",
      value: "",
      created_at: ""
    });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const columns: TableProps<ITransaction>["columns"] = [
    {
      title: "Mã yêu cầu",
      dataIndex: "request_id",
      key: "request_id"
    },
    {
      title: "Nhà mạng",
      dataIndex: "telco",
      key: "telco"
    },
    {
      title: "Giá trị khai báo",
      dataIndex: "declared_value",
      key: "declared_value",
      render: (value: number | null) =>
        value ? `${value.toLocaleString()} VND` : "-"
    },
    {
      title: "Giá trị thực nhận",
      dataIndex: "value",
      key: "value",
      render: (value: number | null) =>
        value ? `${value.toLocaleString()} VND` : "-"
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount.toLocaleString()} VND`
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const statusMap: Record<CardStatus, { label: string; color: string }> =
          {
            [CardStatus.SUCCESS_CORRECT]: {
              label: "SUCCESS_CORRECT",
              color: "green"
            },
            [CardStatus.SUCCESS_INCORRECT]: {
              label: "SUCCESS_INCORRECT",
              color: "blue"
            },
            [CardStatus.FAILED]: { label: "FAILED", color: "red" },
            [CardStatus.MAINTENANCE]: { label: "MAINTENANCE", color: "orange" },
            [CardStatus.PENDING]: { label: "PENDING", color: "gold" },
            [CardStatus.SUBMIT_FAILED]: {
              label: "SUBMIT_FAILED",
              color: "purple"
            }
          };
        const { label, color } = statusMap[status as CardStatus] || {
          label: "Không xác định",
          color: "gray"
        };
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: Date) => new Date(created_at).toLocaleString()
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
      )
    }
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
                <div
                  id="table_id_wrapper"
                  className="dataTables_wrapper no-footer"
                >
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
                            <option value="1">
                              Thành công (đúng mệnh giá)
                            </option>
                            <option value="2">Thành công (sai mệnh giá)</option>
                            <option value="3">Thất bại</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <input
                            type="number"
                            name="value"
                            className="form-control"
                            placeholder="Giá trị"
                            value={formData.value}
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
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
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
                        key: transaction.id
                      }))}
                      locale={{ emptyText: "Không có dữ liệu" }}
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
