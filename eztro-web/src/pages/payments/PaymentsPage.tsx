import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Home,
  User,
  Calendar,
  DollarSign,
  ArrowLeft,
  Search,
  Filter,
  Download,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import { paymentGetAPI } from "../../api/paymentAPI/GET";
import "./styles/PaymentsPage.css";

interface HousePackage {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  houseId: {
    _id: string;
    houseName: string;
    address: string;
  };
  packageId: {
    _id: string;
    packageName: string;
    price: number;
    duration: number;
    maxRoom: number;
  };
  expirationDate: string;
  createDate: string;
}

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<HousePackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<HousePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired">("all");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const getRoleName = () => {
    if (user?.roleName) return user.roleName;
    if (user?.roleId && typeof user.roleId === "object" && "name" in user.roleId) {
      return user.roleId.name;
    }
    return "Unknown";
  };

  const roleName = getRoleName();
  const isAdmin = roleName === "Admin" || roleName === "admin";
  const isStaff = roleName === "Staff" || roleName === "staff";

  useEffect(() => {
    if (!isAdmin && !isStaff) {
      navigate("/");
      return;
    }
    loadPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm, filterStatus]);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const response = await paymentGetAPI.getAllHousePackages() as any;

      if (response?.data && Array.isArray(response.data)) {
        setPackages(response.data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.houseId?.houseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.packageId?.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      const now = new Date();
      filtered = filtered.filter((pkg) => {
        const expDate = new Date(pkg.expirationDate);
        if (filterStatus === "active") {
          return expDate > now;
        } else if (filterStatus === "expired") {
          return expDate <= now;
        }
        return true;
      });
    }

    setFilteredPackages(filtered);
  };

  const getStatusBadge = (expirationDate: string) => {
    const now = new Date();
    const expDate = new Date(expirationDate);
    const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <span className="badge badge-expired">Hết hạn</span>;
    } else if (daysLeft < 30) {
      return <span className="badge badge-warning">Sắp hết hạn ({daysLeft} ngày)</span>;
    } else {
      return <span className="badge badge-active">Hoạt động ({daysLeft} ngày)</span>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const exportToCSV = () => {
    if (filteredPackages.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    // Prepare CSV headers
    const headers = [
      "Nhà trọ",
      "Địa chỉ",
      "Người dùng",
      "Email",
      "Gói",
      "Giá (VND)",
      "Thời hạn (tháng)",
      "Ngày mua",
      "Ngày hết hạn",
      "Trạng thái",
    ];

    // Prepare CSV rows
    const rows = filteredPackages.map((pkg) => {
      const now = new Date();
      const expDate = new Date(pkg.expirationDate);
      const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      let status = "Hoạt động";
      if (daysLeft < 0) {
        status = "Hết hạn";
      } else if (daysLeft < 30) {
        status = `Sắp hết hạn (${daysLeft} ngày)`;
      }

      return [
        pkg.houseId?.houseName || "",
        pkg.houseId?.address || "",
        `${pkg.userId?.firstName} ${pkg.userId?.lastName}`,
        pkg.userId?.email || "",
        pkg.packageId?.packageName || "",
        pkg.packageId?.price || 0,
        pkg.packageId?.duration || 0,
        formatDate(pkg.createDate),
        formatDate(pkg.expirationDate),
        status,
      ];
    });

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell);
            if (cellStr.includes(",") || cellStr.includes('"')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `bao-cao-giao-dich-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateStats = () => {
    const now = new Date();
    const active = packages.filter((pkg) => new Date(pkg.expirationDate) > now).length;
    const expired = packages.filter((pkg) => new Date(pkg.expirationDate) <= now).length;
    const totalRevenue = packages.reduce((sum, pkg) => sum + (pkg.packageId?.price || 0), 0);

    return { active, expired, totalRevenue };
  };

  const stats = calculateStats();

  return (
    <div className="payments-wrapper">
      <Sidebar user={user} isAdmin={isAdmin} />

      <div className="payments-container">
        {/* Header */}
        <div className="payments-header">
          <div className="header-top">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={20} />
            </button>
            <h1>Giao dịch thanh toán</h1>
            <button className="export-button" onClick={exportToCSV}>
              <Download size={20} />
              Xuất báo cáo
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Gói đang hoạt động</p>
                <h3 className="stat-value">{stats.active}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Gói hết hạn</p>
                <h3 className="stat-value">{stats.expired}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Tổng doanh thu</p>
                <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Package size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">Tổng gói bán</p>
                <h3 className="stat-value">{packages.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên nhà, người dùng, gói..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
              <Filter size={16} />
              Tất cả
            </button>
            <button
              className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => setFilterStatus("active")}
            >
              Đang hoạt động
            </button>
            <button
              className={`filter-btn ${filterStatus === "expired" ? "active" : ""}`}
              onClick={() => setFilterStatus("expired")}
            >
              Hết hạn
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-section">
          {loading ? (
            <div className="loading">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <p>Không có gói nào</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Nhà trọ</th>
                    <th>Người dùng</th>
                    <th>Gói</th>
                    <th>Giá</th>
                    <th>Thời hạn (tháng)</th>
                    <th>Ngày mua</th>
                    <th>Ngày hết hạn</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td>
                        <div className="cell-content">
                          <Home size={16} />
                          <div>
                            <p className="cell-title">{pkg.houseId?.houseName}</p>
                            <p className="cell-subtitle">{pkg.houseId?.address}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cell-content">
                          <User size={16} />
                          <div>
                            <p className="cell-title">
                              {pkg.userId?.firstName} {pkg.userId?.lastName}
                            </p>
                            <p className="cell-subtitle">{pkg.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cell-content">
                          <Package size={16} />
                          <p className="cell-title">{pkg.packageId?.packageName}</p>
                        </div>
                      </td>
                      <td>
                        <p className="cell-price">{formatCurrency(pkg.packageId?.price || 0)}</p>
                      </td>
                      <td>
                        <p className="cell-text">{pkg.packageId?.duration} tháng</p>
                      </td>
                      <td>
                        <p className="cell-text">{formatDate(pkg.createDate)}</p>
                      </td>
                      <td>
                        <p className="cell-text">{formatDate(pkg.expirationDate)}</p>
                      </td>
                      <td>{getStatusBadge(pkg.expirationDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Info */}
        {filteredPackages.length > 0 && (
          <div className="pagination-info">
            <p>
              Hiển thị {filteredPackages.length} trong {packages.length} giao dịch
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
