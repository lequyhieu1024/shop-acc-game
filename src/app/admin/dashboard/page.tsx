"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import Loading from "@/components/Loading";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface DashboardData {
  revenue: {
    month: number;
    quarter: number;
    week: number;
    historical: { month: string; revenue: number }[];
  };
  acc: {
    total: number;
    sold: number;
    available: number;
    locked: number;
    top: { product_id: number; product_name: string, sold_count: number }[];
  };
  orders: {
    total: number;
    completed: number;
    processing: number;
    failed: number;
    pending: number;
    cancelled: number;
  };
  users: {
    total: number;
    newThisMonth: number;
    historical: { month: string; newUsers: number }[];
  };
  topCard: { user_id: number; total_amount: number; username: string; user_code: string; phone: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const result = await res.json();
        setData(result);
      } catch (e) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", (e as Error).message);
        toast.error("Không thể tải dữ liệu dashboard. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading/>;
  if (!data) return <h1>Không có dữ liệu</h1>;

  const formatNumber = (value: number) =>
      value.toLocaleString("vi-VN", { style: "decimal" });

  // Chart 1: Revenue Over Time (Line Chart)
  const revenueChartData = {
    labels: data.revenue.historical.map((item) => item.month),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: data.revenue.historical.map((item) => item.revenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart 2: Order Status Distribution (Pie Chart)
  const orderChartData = {
    labels: ["Chờ xử lý", "Đang bàn giao nick","Đã bàn giao nick", "Lỗi", "Đã hủy"],
    datasets: [
      {
        data: [
          data.orders.pending,
          data.orders.processing,
          data.orders.completed,
          data.orders.cancelled,
          data.orders.failed,
        ],
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#FF9F40",
          "#FF6384",
          "#4BC0C0",
        ],
      },
    ],
  };

  // Chart 3: Product Availability Breakdown (Bar Chart)
  const productChartData = {
    labels: ["Tổng sản phẩm", "Không dùng để bán", "Sẵn sàng bán"],
    datasets: [
      {
        label: "Số lượng",
        data: [data.acc.total, data.acc.sold, data.acc.available],
        backgroundColor: ["#36A2EB", "#FF6384", "#4BC0C0"],
      },
    ],
  };

  // Chart 4: Top 5 Products by Sales (Horizontal Bar Chart)
  const topProductsChartData = {
    labels: data.acc.top.map((item) => item.product_name),
    datasets: [
      {
        label: "Số lượng bán",
        data: data.acc.top.map((item) => item.sold_count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  // Chart 5: User Growth (Area Chart)
  const userGrowthChartData = {
    labels: data.users.historical.map((item) => item.month),
    datasets: [
      {
        label: "Khách hàng mới",
        data: data.users.historical.map((item) => item.newUsers),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart 6: Top Card Spenders (Bar Chart)
  const topCardChartData = {
    labels: data.topCard.map((item) => item.username),
    datasets: [
      {
        label: "Số tiền nạp (VNĐ)",
        data: data.topCard.map((item) => item.total_amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
      <div className="container-fluid">
        <div className="row">
          {/* Card 1: Revenue */}
          <div className="col-sm-6 col-xxl-3 col-lg-6">
            <div className="main-tiles border-5 border-0 card-hover card o-hidden">
              <div className="custome-1-bg b-r-4 card-body">
                <div className="media static-top-widget">
                  <div className="media-body p-0">
                    <span className="m-0">Tổng doanh thu tháng</span>
                    <h4 className="mb-0 counter">
                      {formatNumber(data.revenue.month)} đ
                    </h4>
                    <span className="m-0">Tổng doanh thu tuần: {formatNumber(data.revenue.week)} đ</span>
                  </div>
                  <div className="align-self-center text-center">
                    <i className="ri-database-2-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thẻ Đơn hàng */}
          <div className="col-sm-6 col-xxl-3 col-lg-6">
            <div className="main-tiles border-5 card-hover border-0 card o-hidden">
              <div className="custome-2-bg b-r-4 card-body">
                <div className="media static-top-widget">
                  <div className="media-body p-0">
                    <span className="m-0">Đơn hàng</span>
                    <h4 className="mb-0 counter">
                      {formatNumber(data.orders.total)}
                    </h4>
                    <div className="m-0">Chờ xử lý: {formatNumber(data.orders.pending)}</div>
                    <div className="m-0">Đang bàn giao: {formatNumber(data.orders.processing)}</div>
                    <div className="m-0">Đã bàn giao: {formatNumber(data.orders.completed)}</div>
                    <div className="m-0">Có lỗi: {formatNumber(data.orders.failed)}</div>
                    <div className="m-0">Đã hủy: {formatNumber(data.orders.cancelled)}</div>
                  </div>
                  <div className="align-self-center text-center">
                    <i className="ri-shopping-bag-3-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thẻ Total Products */}
          <div className="col-sm-6 col-xxl-3 col-lg-6">
            <div className="main-tiles border-5 card-hover border-0 card o-hidden">
              <div className="custome-3-bg b-r-4 card-body">
                <div className="media static-top-widget">
                  <div className="media-body p-0">
                    <span className="m-0">Sản phẩm</span>
                    <h4 className="mb-0 counter">
                      {formatNumber(data.acc.total)}
                    </h4>
                    <div className="m-0">Không dùng để bán: {formatNumber(data.acc.sold)}</div>
                    <div className="m-0">Sẵn sàng bán: {formatNumber(data.acc.available)}</div>
                  </div>
                  <div className="align-self-center text-center">
                    <i className="ri-chat-3-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thẻ Total Customers */}
          <div className="col-sm-6 col-xxl-3 col-lg-6">
            <div className="main-tiles border-5 card-hover border-0 card o-hidden">
              <div className="custome-4-bg b-r-4 card-body">
                <div className="media static-top-widget">
                  <div className="media-body p-0">
                    <span className="m-0">Khách hàng</span>
                    <h4 className="mb-0 counter">
                      {formatNumber(data.users.total)}
                    </h4>
                    <span className="m-0">KH mới trong tháng này: {formatNumber(data.users.newThisMonth)}</span>
                  </div>
                  <div className="align-self-center text-center">
                    <i className="ri-user-add-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5>Thống kê trực quan</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h6>Doanh thu theo thời gian</h6>
                    <Line
                        data={revenueChartData}
                        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6>Phân bố trạng thái đơn hàng</h6>
                    <Pie
                        data={orderChartData}
                        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6>Tình trạng sản phẩm</h6>
                    <Bar
                        data={productChartData}
                        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6>Top 5 sản phẩm bán chạy</h6>
                    <Bar
                        data={topProductsChartData}
                        options={{
                          responsive: true,
                          indexAxis: "y",
                          plugins: { legend: { position: "top" } },
                        }}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6>Tăng trưởng khách hàng</h6>
                    <Line
                        data={userGrowthChartData}
                        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6>Top khách hàng nạp thẻ</h6>
                    <Bar
                        data={topCardChartData}
                        options={{ responsive: true, plugins: { legend: { position: "top" } } }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Card Table */}
          {data.topCard.length > 0 && (
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header">
                    <h5>Top Nạp Thẻ</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered">
                        <thead>
                        <tr>
                          <th>Username</th>
                          <th>Tên</th>
                          <th>Số điện thoại</th>
                          <th>Số tiền đã nạp</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.topCard.map((card, index) => (
                            <tr key={index}>
                              <td>{card.username}</td>
                              <td>{card.user_code}</td>
                              <td>{card.phone}</td>
                              <td>{formatNumber(card.total_amount)} đ</td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}