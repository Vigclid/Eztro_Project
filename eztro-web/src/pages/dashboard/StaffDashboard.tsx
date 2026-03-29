import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  LifeBuoy,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronRight,
  Shield,
  BarChart3,
} from "lucide-react";
import {
  Line,
  BarChart,
  Bar,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../../components/dashboard/Sidebar";
import { reportGetAPI } from "../../api/reportAPI/GET";
import { userGetAPI } from "../../api/userAPI/GET";
import { paymentGetAPI } from "../../api/paymentAPI/GET";
import "./styles/StaffDashboard.css";

interface DashboardStats {
  users: {
    total: number;
    active: number;
  };
  revenue: {
    total: number;
    packages: number;
  };
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    highPriority: number;
    resolved: number;
  };
  activity: {
    today: number;
    total: number;
    uniqueUsers: number;
    successRate: number;
  };
}

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0 },
    revenue: { total: 0, packages: 0 },
    tickets: { total: 0, open: 0, inProgress: 0, highPriority: 0, resolved: 0 },
    activity: { today: 0, total: 0, uniqueUsers: 0, successRate: 0 },
  });

  // Chart data
  const [revenueChartData, setRevenueChartData] = useState([
    { month: "Jan", revenue: 4000, target: 5000 },
    { month: "Feb", revenue: 3000, target: 5000 },
    { month: "Mar", revenue: 2000, target: 5000 },
    { month: "Apr", revenue: 2780, target: 5000 },
    { month: "May", revenue: 1890, target: 5000 },
    { month: "Jun", revenue: 2390, target: 5000 },
  ]);

  const [ticketChartData, setTicketChartData] = useState([
    { name: "Chờ xử lý", value: 0, color: "#f59e0b" },
    { name: "Đang xử lý", value: 0, color: "#3b82f6" },
    { name: "Đã giải quyết", value: 0, color: "#10b981" },
  ]);

  const [userGrowthData, setUserGrowthData] = useState([
    { week: "Tuần 1", users: 0, active: 0 },
    { week: "Tuần 2", users: 0, active: 0 },
    { week: "Tuần 3", users: 0, active: 0 },
    { week: "Tuần 4", users: 0, active: 0 },
  ]);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const getRoleName = () => {
    if (user?.roleName) return user.roleName;
    if (
      user?.roleId &&
      typeof user.roleId === "object" &&
      "name" in user.roleId
    ) {
      return user.roleId.name;
    }
    return "Unknown";
  };

  const roleName = getRoleName();
  const isAdmin = roleName === "Admin" || roleName === "admin";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      
      // Load users data
      const usersRes = await userGetAPI.getAllUsers() as any;
      
      if (!usersRes) {
        return;
      }
      
      if (usersRes.error) {
      }
      
      const users = Array.isArray(usersRes?.data) ? usersRes.data : [];

      // Load reports data
      const reportsRes = await reportGetAPI.getAllReports() as any;
      
      if (!reportsRes) {
        return;
      }
      
      if (reportsRes.error) {
      }
      
      const reports = Array.isArray(reportsRes?.data) ? reportsRes.data : [];

      // Load revenue data
      
      const revenueDailyRes = await paymentGetAPI.getRevenueByDay() as any;
      
      const revenueTotalRes = await paymentGetAPI.getTotalRevenue() as any;

      // Transform daily revenue data for chart
      let chartData = revenueChartData;
      if (revenueDailyRes?.data && Array.isArray(revenueDailyRes.data)) {
        chartData = revenueDailyRes.data.map((item: any) => {
          const dateStr = `${item._id.day}/${item._id.month}/${item._id.year}`;
          return {
            date: dateStr,
            revenue: item.revenue || 0,
            packages: item.count || 0,
          };
        });
      }
      setRevenueChartData(chartData);

      // Get total revenue
      let totalRevenue = 45000000;
      if (revenueTotalRes?.data && revenueTotalRes.data.totalRevenue) {
        totalRevenue = revenueTotalRes.data.totalRevenue;
      }

      // Get total packages sold
      let totalPackagesSold = 0;
      if (revenueTotalRes?.data && revenueTotalRes.data.totalPackages) {
        totalPackagesSold = revenueTotalRes.data.totalPackages;
      }

      // Calculate report statistics
      const pending = reports.filter((r: any) => r.status === "Pending").length;
      const inProgress = reports.filter((r: any) => r.status === "InProgress").length;
      const resolved = reports.filter((r: any) => r.status === "Resolved").length;

      // Update ticket chart data
      setTicketChartData([
        { name: "Chờ xử lý", value: pending, color: "#f59e0b" },
        { name: "Đang xử lý", value: inProgress, color: "#3b82f6" },
        { name: "Đã giải quyết", value: resolved, color: "#10b981" },
      ]);

      // Calculate user growth data based on createdAt
      const now = new Date();
      
      // Create 4 weeks data
      const weeklyData = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        
        // Get all users created up to the end of this week (cumulative)
        const cumulativeUsers = users.filter((u: any) => {
          const createdDate = new Date(u.createdAt);
          return createdDate < weekEnd;
        });
        
        // Get active users from cumulative users
        const activeUsers = cumulativeUsers.filter((u: any) => u.statusActive).length;
        
        const weekLabel = `${weekStart.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })} - ${weekEnd.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}`;
        
        weeklyData.push({
          week: weekLabel,
          users: cumulativeUsers.length,
          active: activeUsers,
        });
      }
      setUserGrowthData(weeklyData);

      setStats({
        users: { total: users.length, active: users.filter((u: any) => u.statusActive).length },
        revenue: { total: totalRevenue, packages: totalPackagesSold },
        tickets: {
          total: reports.length,
          open: pending,
          inProgress: inProgress,
          highPriority: pending,
          resolved: resolved,
        },
        activity: {
          today: reports.filter((r: any) => {
            const reportDate = new Date(r.createdAt);
            const today = new Date();
            return reportDate.toDateString() === today.toDateString();
          }).length,
          total: reports.length,
          uniqueUsers: new Set(reports.filter((r: any) => r.userId).map((r: any) => r.userId._id)).size,
          successRate: reports.length > 0 ? Math.round((resolved / reports.length) * 100) : 0,
        },
      });
    } catch (error) {
      setStats({
        users: { total: 0, active: 0 },
        revenue: { total: 0, packages: 0 },
        tickets: {
          total: 0,
          open: 0,
          inProgress: 0,
          highPriority: 0,
          resolved: 0,
        },
        activity: { 
          today: 0, 
          total: 0, 
          uniqueUsers: 0, 
          successRate: 0 
        },
      });
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar user={user} isAdmin={isAdmin} />
      
      <div className="dashboard-container">
        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-section">
            <h2 className="section-title">Tổng quan</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-green">
                    <Users size={24} />
                  </div>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Người dùng</p>
                  <h3 className="stat-value">{stats.users.total}</h3>
                  <p className="stat-subtitle">{stats.users.active} hoạt động</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-orange">
                    <DollarSign size={24} />
                  </div>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Doanh thu</p>
                  <h3 className="stat-value">
                    {(stats.revenue.total / 1000000).toFixed(1)}M
                  </h3>
                  <p className="stat-subtitle">{stats.revenue.packages} gói đã bán</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-blue">
                    <LifeBuoy size={24} />
                  </div>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Hỗ trợ</p>
                  <h3 className="stat-value">{stats.tickets.total}</h3>
                  <p className="stat-subtitle">{stats.tickets.inProgress} đang xử lý</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon stat-icon-purple">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div className="stat-body">
                  <p className="stat-label">Hoạt động</p>
                  <h3 className="stat-value">{stats.activity.today}</h3>
                  <p className="stat-subtitle">Hôm nay</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Revenue Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Doanh thu theo ngày</h3>
                <button className="chart-link">Xem chi tiết</button>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis yAxisId="left" stroke="#10b981" />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                      formatter={(value: any) => {
                        if (typeof value === 'number') {
                          return value.toLocaleString('vi-VN');
                        }
                        return value;
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: "#10b981", r: 4 }}
                      name="Doanh thu (VND)"
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="packages" 
                      fill="#3b82f6" 
                      name="Số gói bán"
                      radius={[8, 8, 0, 0]}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ticket Status Pie Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Trạng thái phiếu hỗ trợ</h3>
                <button className="chart-link">Xem chi tiết</button>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Tăng trưởng người dùng</h3>
                <button className="chart-link">Xem chi tiết</button>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Bar dataKey="users" fill="#3b82f6" name="Tổng người dùng" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="active" fill="#10b981" name="Người dùng hoạt động" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tickets Summary */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Phiếu hỗ trợ</h3>
                <button className="chart-link">Xem chi tiết</button>
              </div>
              <div className="chart-content">
                <div className="tickets-summary">
                  <div className="ticket-stat">
                    <div className="ticket-stat-icon ticket-stat-icon-yellow">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4>{stats.tickets.open}</h4>
                      <p>Chờ xử lý</p>
                    </div>
                  </div>

                  <div className="ticket-stat">
                    <div className="ticket-stat-icon ticket-stat-icon-blue">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h4>{stats.tickets.inProgress}</h4>
                      <p>Đang xử lý</p>
                    </div>
                  </div>

                  <div className="ticket-stat">
                    <div className="ticket-stat-icon ticket-stat-icon-green">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4>{stats.tickets.resolved}</h4>
                      <p>Đã giải quyết</p>
                    </div>
                  </div>

                  <div className="ticket-stat">
                    <div className="ticket-stat-icon ticket-stat-icon-indigo">
                      <LifeBuoy size={20} />
                    </div>
                    <div>
                      <h4>{stats.tickets.total}</h4>
                      <p>Tổng cộng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-section">
            <h2 className="section-title">Truy cập nhanh</h2>
            <div className="actions-grid">
              <button className="action-card" onClick={() => navigate("/users")}>
                <div className="action-icon action-icon-green">
                  <Users size={20} />
                </div>
                <div className="action-content">
                  <h4>Người dùng</h4>
                  <p>Quản lý tài khoản</p>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </button>

              <button className="action-card" onClick={() => navigate("/payments")}>
                <div className="action-icon action-icon-orange">
                  <DollarSign size={20} />
                </div>
                <div className="action-content">
                  <h4>Thanh toán</h4>
                  <p>Xem giao dịch</p>
                </div>
                <ChevronRight size={20} color="#9ca3af" />
              </button>

              <button className="action-card" onClick={() => navigate("/support")}>
                <div className="action-icon action-icon-blue">
                  <LifeBuoy size={20} />
                </div>
                <div className="action-content">
                  <h4>Hỗ trợ</h4>
                  <p>Phiếu yêu cầu</p>
                </div>
                {stats.tickets.open > 0 && (
                  <div className="action-badge">{stats.tickets.open}</div>
                )}
                <ChevronRight size={20} color="#9ca3af" />
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="actions-section">
              <h2 className="section-title">Quản trị viên</h2>
              <div className="actions-grid">
                <button className="action-card" onClick={() => navigate("/admin/staff")}>
                  <div className="action-icon action-icon-purple">
                    <Shield size={20} />
                  </div>
                  <div className="action-content">
                    <h4>Quản lý nhân viên</h4>
                    <p>Tài khoản & phân quyền</p>
                  </div>
                  <ChevronRight size={20} color="#9ca3af" />
                </button>

                <button className="action-card" onClick={() => navigate("/admin/logs")}>
                  <div className="action-icon action-icon-indigo">
                    <BarChart3 size={20} />
                  </div>
                  <div className="action-content">
                    <h4>Web Log</h4>
                    <p>Lịch sử hoạt động</p>
                  </div>
                  <ChevronRight size={20} color="#9ca3af" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
