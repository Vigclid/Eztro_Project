import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  DollarSign,
  LifeBuoy,
  Activity,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronRight,
  User,
  Bell,
  Search,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react";
import { reportGetAPI } from "../../api/reportAPI/GET";
import "./styles/StaffDashboard.css";

interface DashboardStats {
  users: {
    total: number;
    active: number;
  };
  revenue: {
    total: number;
    paid: number;
    pending: number;
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
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0 },
    revenue: { total: 0, paid: 0, pending: 0 },
    tickets: { total: 0, open: 0, inProgress: 0, highPriority: 0, resolved: 0 },
    activity: { today: 0, total: 0, uniqueUsers: 0, successRate: 0 },
  });

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
    setLoading(true);
    try {
      // Load reports data
      const reportsRes = await reportGetAPI.getAllReports();

      if (reportsRes.status === "success" && reportsRes.data) {
        const reports = Array.isArray(reportsRes.data) ? reportsRes.data : [];

        // Calculate report statistics
        const pending = reports.filter((r) => r.status === "Pending").length;
        const inProgress = reports.filter(
          (r) => r.status === "InProgress",
        ).length;
        const resolved = reports.filter((r) => r.status === "Resolved").length;

        setStats({
          users: { total: 156, active: 142 }, // TODO: Load from users API
          revenue: { total: 45000000, paid: 38, pending: 12 }, // TODO: Load from invoices API
          tickets: {
            total: reports.length,
            open: pending,
            inProgress: inProgress,
            highPriority: pending, // Using pending as high priority for now
            resolved: resolved,
          },
          activity: {
            today: 234,
            total: 1847,
            uniqueUsers: 89,
            successRate: 94,
          }, // TODO: Load from activity API
        });
      } else {
        // Fallback to mock data if API fails
        setStats({
          users: { total: 156, active: 142 },
          revenue: { total: 45000000, paid: 38, pending: 12 },
          tickets: {
            total: 0,
            open: 0,
            inProgress: 0,
            highPriority: 0,
            resolved: 0,
          },
          activity: {
            today: 234,
            total: 1847,
            uniqueUsers: 89,
            successRate: 94,
          },
        });
      }
    } catch (error) {
      // Use mock data on error
      setStats({
        users: { total: 156, active: 142 },
        revenue: { total: 45000000, paid: 38, pending: 12 },
        tickets: {
          total: 0,
          open: 0,
          inProgress: 0,
          highPriority: 0,
          resolved: 0,
        },
        activity: { today: 234, total: 1847, uniqueUsers: 89, successRate: 94 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div
          className="loading-spinner"
          style={{ width: "40px", height: "40px", borderWidth: "4px" }}
        />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="avatar">
              <User size={32} color="#fff" />
            </div>
            <div className="header-text">
              <p className="greeting">Xin chào,</p>
              <h2 className="username">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email?.split("@")[0] || "Staff"}
              </h2>
              <p className="role">
                {isAdmin ? "🔐 Quản trị viên" : "👤 Nhân viên"}
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-button">
              <Search size={24} />
            </button>
            <button className="icon-button">
              <Bell size={24} />
            </button>
            <button className="icon-button">
              <Settings size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {isAdmin && (
          <div className="admin-banner">
            <div className="admin-banner-icon">
              <Shield size={28} />
            </div>
            <div className="admin-banner-content">
              <h3>Quyền quản trị viên</h3>
              <p>
                Bạn có quyền truy cập đầy đủ vào các tính năng quản lý hệ thống
              </p>
            </div>
          </div>
        )}

        <div className="section">
          <h2 className="section-title">Tổng quan hệ thống</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                <Users size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Người dùng</p>
                <h3 className="stat-value">{stats.users.total}</h3>
                <p className="stat-change stat-change-positive">
                  +{stats.users.active} hoạt động
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-orange">
                <DollarSign size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Doanh thu</p>
                <h3 className="stat-value">
                  {(stats.revenue.total / 1000000).toFixed(1)}M
                </h3>
                <p className="stat-change stat-change-positive">
                  {stats.revenue.paid}/
                  {stats.revenue.paid + stats.revenue.pending} đã thu
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-blue">
                <LifeBuoy size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Hỗ trợ</p>
                <h3 className="stat-value">{stats.tickets.total}</h3>
                <p className="stat-change stat-change-negative">
                  {stats.tickets.inProgress} đang xử lý
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                <Activity size={28} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Hoạt động</p>
                <h3 className="stat-value">{stats.activity.today}</h3>
                <p className="stat-change stat-change-positive">Hôm nay</p>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="section">
            <h2 className="section-title">Quản trị viên - Truy cập nhanh</h2>
            <div className="actions-grid">
              <button className="action-card">
                <div className="action-icon action-icon-purple">
                  <Shield size={24} />
                </div>
                <div className="action-content">
                  <h4>Quản lý nhân viên</h4>
                  <p>Tài khoản & phân quyền</p>
                </div>
                <ChevronRight size={24} color="#9ca3af" />
              </button>

              <button className="action-card">
                <div className="action-icon action-icon-cyan">
                  <Settings size={24} />
                </div>
                <div className="action-content">
                  <h4>Cài đặt hệ thống</h4>
                  <p>Cấu hình & tùy chỉnh</p>
                </div>
                <ChevronRight size={24} color="#9ca3af" />
              </button>

              <button className="action-card">
                <div className="action-icon action-icon-orange">
                  <BarChart3 size={24} />
                </div>
                <div className="action-content">
                  <h4>Báo cáo hệ thống</h4>
                  <p>Phân tích & thống kê</p>
                </div>
                <ChevronRight size={24} color="#9ca3af" />
              </button>
            </div>
          </div>
        )}

        <div className="section">
          <h2 className="section-title">
            {isAdmin ? "Quản lý chung" : "Truy cập nhanh"}
          </h2>
          <div className="actions-grid">
            <button className="action-card">
              <div className="action-icon action-icon-green">
                <Users size={24} />
              </div>
              <div className="action-content">
                <h4>Người dùng</h4>
                <p>Quản lý tài khoản</p>
              </div>
              <ChevronRight size={24} color="#9ca3af" />
            </button>

            <button className="action-card">
              <div className="action-icon action-icon-orange">
                <DollarSign size={24} />
              </div>
              <div className="action-content">
                <h4>Thanh toán</h4>
                <p>Xem giao dịch</p>
              </div>
              <ChevronRight size={24} color="#9ca3af" />
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/support")}
            >
              <div className="action-icon action-icon-blue">
                <LifeBuoy size={24} />
              </div>
              <div className="action-content">
                <h4>Hỗ trợ</h4>
                <p>Phiếu yêu cầu</p>
              </div>
              {stats.tickets.open > 0 && (
                <div className="action-badge">
                  <span>{stats.tickets.open}</span>
                </div>
              )}
              <ChevronRight size={24} color="#9ca3af" />
            </button>

            <button className="action-card">
              <div className="action-icon action-icon-cyan">
                <Activity size={24} />
              </div>
              <div className="action-content">
                <h4>Hoạt động</h4>
                <p>Lịch sử hệ thống</p>
              </div>
              <ChevronRight size={24} color="#9ca3af" />
            </button>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Phiếu hỗ trợ</h2>
            <button
              className="section-link"
              onClick={() => navigate("/support")}
            >
              Xem tất cả
            </button>
          </div>

          <div className="tickets-summary">
            <div className="ticket-stat">
              <div className="ticket-stat-icon ticket-stat-icon-yellow">
                <Clock size={24} />
              </div>
              <div>
                <h3>{stats.tickets.open}</h3>
                <p>Chờ xử lý</p>
              </div>
            </div>

            <div className="ticket-stat">
              <div className="ticket-stat-icon ticket-stat-icon-blue">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3>{stats.tickets.inProgress}</h3>
                <p>Đang xử lý</p>
              </div>
            </div>

            <div className="ticket-stat">
              <div className="ticket-stat-icon ticket-stat-icon-green">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3>{stats.tickets.resolved}</h3>
                <p>Đã giải quyết</p>
              </div>
            </div>

            <div className="ticket-stat">
              <div className="ticket-stat-icon ticket-stat-icon-indigo">
                <LifeBuoy size={24} />
              </div>
              <div>
                <h3>{stats.tickets.total}</h3>
                <p>Tổng cộng</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Hoạt động gần đây</h2>
            <button className="section-link">Xem chi tiết</button>
          </div>

          <div className="activity-stats">
            <div className="activity-stat-card">
              <div className="activity-stat-icon">
                <Activity size={24} color="#10b981" />
              </div>
              <div>
                <p>Tổng hoạt động</p>
                <h3>{stats.activity.total}</h3>
              </div>
            </div>

            <div className="activity-stat-card">
              <div className="activity-stat-icon">
                <Users size={24} color="#3b82f6" />
              </div>
              <div>
                <p>Người dùng hoạt động</p>
                <h3>{stats.activity.uniqueUsers}</h3>
              </div>
            </div>

            <div className="activity-stat-card">
              <div className="activity-stat-icon">
                <CheckCircle size={24} color="#10b981" />
              </div>
              <div>
                <p>Tỷ lệ thành công</p>
                <h3>{stats.activity.successRate}%</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
