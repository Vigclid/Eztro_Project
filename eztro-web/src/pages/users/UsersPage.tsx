import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import { userGetAPI } from "../../api/userAPI/GET";
import { userPutAPI } from "../../api/userAPI/PUT";
import { IUser } from "../../types/user";
import "./styles/UsersPage.css";

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [banningUserId, setBanningUserId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: string | null; action: "ban" | "unban" | null; userName: string }>({
    isOpen: false,
    userId: null,
    action: null,
    userName: "",
  });

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const getRoleName = () => {
    if (currentUser?.roleName) return currentUser.roleName;
    if (currentUser?.roleId && typeof currentUser.roleId === "object" && "name" in currentUser.roleId) {
      return currentUser.roleId.name;
    }
    return "Unknown";
  };

  const roleName = getRoleName();
  const isAdmin = roleName === "Admin" || roleName === "admin";

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userGetAPI.getAllUsers() as any;
      if (res.status === "success" && res.data) {
        const usersArray = Array.isArray(res.data) ? res.data : [];
        setUsers(usersArray);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (user: IUser): string => {
    if (typeof user.roleId === "object" && user.roleId?.name) {
      return user.roleId.name;
    }
    return user.roleName || "Unknown";
  };

  const openConfirmModal = (userId: string, currentStatus: boolean, userName: string) => {
    setConfirmModal({
      isOpen: true,
      userId,
      action: currentStatus ? "ban" : "unban",
      userName,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      userId: null,
      action: null,
      userName: "",
    });
  };

  const handleConfirmBanUser = async () => {
    if (!confirmModal.userId || !confirmModal.action) return;

    setBanningUserId(confirmModal.userId);
    try {
      if (confirmModal.action === "ban") {
        await userPutAPI.lockAccount(confirmModal.userId);
      } else {
        await userPutAPI.unlockAccount(confirmModal.userId);
      }
      // Reload users
      loadUsers();
      closeConfirmModal();
    } catch (error) {
    } finally {
      setBanningUserId(null);
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string | Date | undefined) => {
    if (!dateString) return "Chưa đăng nhập";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredUsers = users.filter((user) => {
    // Filter by status
    if (statusFilter === "active" && !user.statusActive) return false;
    if (statusFilter === "inactive" && user.statusActive) return false;

    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    return (
      (user.email?.toLowerCase().includes(searchLower) || false) ||
      (user.firstName?.toLowerCase().includes(searchLower) || false) ||
      (user.lastName?.toLowerCase().includes(searchLower) || false) ||
      (user.phoneNumber?.includes(searchTerm) || false)
    );
  });

  return (
    <div className="users-wrapper">
      <Sidebar user={currentUser} isAdmin={isAdmin} />
      <div className="users-container">
        {/* Header */}
        <div className="users-header">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={24} />
          </button>
          <h1>Quản lý người dùng</h1>
          <div style={{ width: "40px" }} />
        </div>

        {/* Filters */}
        <div className="users-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo email, tên, số điện thoại..."
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
              className={`filter-btn ${statusFilter === "active" ? "active" : ""}`}
              onClick={() => setStatusFilter("active")}
            >
              Hoạt động
            </button>
            <button
              className={`filter-btn ${statusFilter === "inactive" ? "active" : ""}`}
              onClick={() => setStatusFilter("inactive")}
            >
              Không hoạt động
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="users-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Đang tải người dùng...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <p>Không tìm thấy người dùng nào</p>
            </div>
          ) : (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Ngày sinh</th>
                    <th>Trạng thái</th>
                    <th>Lần đăng nhập cuối</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="user-row">
                      <td className="user-name-cell">
                        <div className="user-info">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.firstName || "User"} className="user-avatar" />
                          ) : (
                            <div className="user-avatar-placeholder">
                              {user.firstName?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <div className="user-full-name">
                              {user.firstName} {user.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="cell-content">
                          <Mail size={16} />
                          {user.email || "-"}
                        </div>
                      </td>
                      <td>
                        <div className="cell-content">
                          <Phone size={16} />
                          {user.phoneNumber || "-"}
                        </div>
                      </td>
                      <td>
                        <div className="role-badge">
                          <Shield size={14} />
                          {getRoleLabel(user)}
                        </div>
                      </td>
                      <td>
                        {user.dateOfBirth ? (
                          <div className="cell-content">
                            <Calendar size={16} />
                            {formatDate(user.dateOfBirth)}
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <div className={`status-badge ${user.statusActive ? "active" : "inactive"}`}>
                          {user.statusActive ? (
                            <>
                              <CheckCircle size={14} />
                              Hoạt động
                            </>
                          ) : (
                            <>
                              <XCircle size={14} />
                              Không hoạt động
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        {user.lastLogin ? (
                          <span className="text-muted">{formatDateTime(user.lastLogin)}</span>
                        ) : (
                          <span className="text-muted">Chưa đăng nhập</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`action-btn ${user.statusActive ? "ban-btn" : "unban-btn"}`}
                          onClick={() => openConfirmModal(user._id || "", user.statusActive || false, `${user.firstName || ""} ${user.lastName || ""}`)}
                          disabled={banningUserId === user._id}
                        >
                          {banningUserId === user._id ? (
                            <span className="loading-spinner" />
                          ) : user.statusActive ? (
                            <>
                              <Lock size={14} />
                              Ban
                            </>
                          ) : (
                            <>
                              <Unlock size={14} />
                              Unban
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirm Modal */}
        {confirmModal.isOpen && (
          <div className="modal-overlay" onClick={closeConfirmModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">
                {confirmModal.action === "ban" ? "Xác nhận Ban người dùng" : "Xác nhận Unban người dùng"}
              </h3>
              <p className="modal-message">
                {confirmModal.action === "ban"
                  ? `Bạn có chắc chắn muốn ban người dùng "${confirmModal.userName}"? Họ sẽ không thể đăng nhập vào hệ thống.`
                  : `Bạn có chắc chắn muốn unban người dùng "${confirmModal.userName}"? Họ sẽ có thể đăng nhập lại vào hệ thống.`}
              </p>
              <div className="modal-actions">
                <button className="modal-cancel-btn" onClick={closeConfirmModal}>
                  Hủy
                </button>
                <button
                  className={`modal-confirm-btn ${confirmModal.action === "ban" ? "ban" : "unban"}`}
                  onClick={handleConfirmBanUser}
                >
                  {confirmModal.action === "ban" ? "Ban người dùng" : "Unban người dùng"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
