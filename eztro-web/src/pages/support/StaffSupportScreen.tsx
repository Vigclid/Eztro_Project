import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bug,
  HelpCircle,
  Lightbulb,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import { reportGetAPI } from "../../api/reportAPI/GET";
import { Report } from "../../types/report";
import socketService from "../../service/socketService";
import "./styles/StaffSupportScreen.css";

const StaffSupportScreen: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
    loadReports();
    
    // Connect to socket and listen for real-time updates
    socketService.connect();
    
    // Listen for new reports
    socketService.onReportCreated((newReport) => {
      setReports((prevReports) => [newReport, ...prevReports]);
    });

    // Listen for report updates (status changes)
    socketService.onReportUpdated((updatedReport) => {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === updatedReport._id ? updatedReport : report
        )
      );
    });

    // Listen for status changes
    socketService.onReportStatusChanged(({ reportId, status }) => {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, status: status as any } : report
        )
      );
    });

    return () => {
      socketService.offReportCreated();
      socketService.offReportUpdated();
      socketService.offReportStatusChanged();
    };
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Backend /all endpoint doesn't support status filter, so we get all and filter on frontend
      const res = await reportGetAPI.getAllReports();
      if (res.status === "success" && res.data) {
        // Backend returns array directly in res.data, not res.data.data
        const reportsArray = Array.isArray(res.data) ? res.data : [];
        setReports(reportsArray);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Help":
        return <HelpCircle size={18} />;
      case "Bug":
        return <Bug size={18} />;
      case "Advice":
        return <Lightbulb size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Help":
        return "Trợ giúp";
      case "Bug":
        return "Báo lỗi";
      case "Advice":
        return "Góp ý";
      default:
        return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "InProgress":
        return "Đang xử lý";
      case "Resolved":
        return "Đã giải quyết";
      case "Closed":
        return "Đã đóng";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} />;
      case "InProgress":
        return <AlertCircle size={16} />;
      case "Resolved":
        return <CheckCircle size={16} />;
      case "Closed":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getUserFullName = (user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null) => {
    if (!user) return "Unknown User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email || "Unknown User";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredReports = reports.filter((report) => {
    // Filter by status
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false;
    }
    // Filter by search term
    return (
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserFullName(report.userId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="support-wrapper">
      <Sidebar user={user} isAdmin={isAdmin} />
      <div className="staff-support-container">
      {/* Header */}
      <div className="support-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={24} />
        </button>
        <h1>Quản lý hỗ trợ</h1>
        <div style={{ width: "40px" }} />
      </div>

      {/* Filters */}
      <div className="support-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${statusFilter === "Pending" ? "active" : ""}`}
            onClick={() => setStatusFilter("Pending")}
          >
            Chờ xử lý
          </button>
          <button
            className={`filter-btn ${statusFilter === "InProgress" ? "active" : ""}`}
            onClick={() => setStatusFilter("InProgress")}
          >
            Đang xử lý
          </button>
          <button
            className={`filter-btn ${statusFilter === "Resolved" ? "active" : ""}`}
            onClick={() => setStatusFilter("Resolved")}
          >
            Đã giải quyết
          </button>
          <button
            className={`filter-btn ${statusFilter === "Closed" ? "active" : ""}`}
            onClick={() => setStatusFilter("Closed")}
          >
            Đã đóng
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="support-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải báo cáo...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <HelpCircle size={48} />
            <p>Không có báo cáo nào</p>
          </div>
        ) : (
          <div className="reports-list">
            {filteredReports.map((report) => (
              <div
                key={report._id}
                className="report-card"
                onClick={() => navigate(`/support/${report._id}`)}
              >
                <div className="report-card-header">
                  <div className="report-type-badge">
                    <span
                      className={`type-icon type-${report.typeReport.toLowerCase()}`}
                    >
                      {getTypeIcon(report.typeReport)}
                    </span>
                    <span className="type-label">
                      {getTypeLabel(report.typeReport)}
                    </span>
                  </div>
                  <div
                    className={`status-badge status-${report.status.toLowerCase()}`}
                  >
                    {getStatusIcon(report.status)}
                    <span>{getStatusLabel(report.status)}</span>
                  </div>
                </div>

                <h3 className="report-title">{report.title}</h3>
                <p className="report-description">
                  {report.description.substring(0, 100)}...
                </p>

                <div className="report-card-footer">
                  <div className="report-user">
                    <span className="user-name">
                      {getUserFullName(report.userId)}
                    </span>
                    <span className="user-email">{report.userId?.email || "N/A"}</span>
                  </div>
                  <div className="report-meta">
                    <span className="reply-count">
                      {report.replies.length} tin nhắn
                    </span>
                    <span className="report-date">
                      {formatDate(report.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default StaffSupportScreen;
