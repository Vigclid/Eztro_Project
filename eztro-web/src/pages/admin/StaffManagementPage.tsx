import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import { userGetAPI } from "../../api/userAPI/GET";
import { userPutAPI } from "../../api/userAPI/PUT";
import { IUser } from "../../types/user";
import "./styles/StaffManagementPage.css";

const StaffManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [staffUsers, setStaffUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [userToRemove, setUserToRemove] = useState<IUser | null>(null);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [roleToAdd, setRoleToAdd] = useState<string>("");
  const [userToAdd, setUserToAdd] = useState<IUser | null>(null);

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
    loadStaffUsers();
  }, []);

  const loadStaffUsers = async () => {
    setLoading(true);
    try {
      const res = await userGetAPI.getStaffAndAdmins() as any;
      if (res.status === "success" && res.data) {
        const users = Array.isArray(res.data) ? res.data : [];
        setStaffUsers(users);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const res = await userGetAPI.searchUsers(query) as any;
      if (res.status === "success" && res.data) {
        const results = Array.isArray(res.data) ? res.data : [];
        const nonStaffUsers = results.filter((user: IUser) => {
          const role = typeof user.roleId === "object" ? user.roleId?.name : user.roleName;
          return role !== "Staff" && role !== "Admin" && role !== "staff" && role !== "admin";
        });
        setSearchResults(nonStaffUsers);
        setShowSearchResults(true);
      }
    } catch (error) {
    }
  };

  const getUserRole = (user: IUser): string => {
    if (typeof user.roleId === "object" && user.roleId?.name) {
      return user.roleId.name;
    }
    return user.roleName || "Unknown";
  };

  const isStaffOrAdmin = (user: IUser): boolean => {
    const role = getUserRole(user);
    return role === "Staff" || role === "Admin" || role === "staff" || role === "admin";
  };

  const isLandlord = (user: IUser): boolean => {
    const role = getUserRole(user);
    return role === "Landlord" || role === "landlord";
  };

  const handleAddStaffRole = (user: IUser) => {
    setRoleToAdd("Staff");
    setUserToAdd(user);
    setShowAddConfirm(true);
  };

  const handleAddAdminRole = (user: IUser) => {
    setRoleToAdd("Admin");
    setUserToAdd(user);
    setShowAddConfirm(true);
  };

  const confirmAddRole = async () => {
    if (!userToAdd || !userToAdd._id) return;

    try {
      await userPutAPI.assignRole(userToAdd._id, roleToAdd);
      setShowAddConfirm(false);
      setUserToAdd(null);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      loadStaffUsers();
    } catch (error) {
    }
  };

  const handleRemoveRole = (user: IUser) => {
    setUserToRemove(user);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveRole = async () => {
    if (!userToRemove || !userToRemove._id) return;

    try {
      await userPutAPI.removeRole(userToRemove._id);
      setShowRemoveConfirm(false);
      setUserToRemove(null);
      loadStaffUsers();
    } catch (error) {
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

  return (
    <div className="staff-wrapper">
      <Sidebar user={currentUser} isAdmin={isAdmin} />
      <div className="staff-container">
        {/* Header */}
        <div className="staff-header">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={24} />
          </button>
          <h1>Quản lý nhân viên</h1>
          <div style={{ width: "40px" }} />
        </div>

        {/* Filters */}
        <div className="staff-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Tìm kiếm</label>
              <input
                type="text"
                placeholder="Tên, email, số điện thoại..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown">
              {searchResults.map((user) => (
                <div key={user._id} className="result-item">
                  <div className="result-info">
                    <div className="result-name">{user.firstName} {user.lastName}</div>
                    <div className="result-details">
                      <span>{user.email}</span>
                      <span>{user.phoneNumber}</span>
                      <span className="role-badge">{getUserRole(user)}</span>
                    </div>
                  </div>
                  {!isStaffOrAdmin(user) && !isLandlord(user) && (
                    <div className="result-actions">
                      <button
                        className="role-option-btn"
                        onClick={() => handleAddStaffRole(user)}
                      >
                        Thêm Staff
                      </button>
                      <button
                        className="role-option-btn admin"
                        onClick={() => handleAddAdminRole(user)}
                      >
                        Thêm Admin
                      </button>
                    </div>
                  )}
                  {(isStaffOrAdmin(user) || isLandlord(user)) && (
                    <div className="result-actions">
                      <span className="disabled-text">
                        {isStaffOrAdmin(user) ? "Đã là nhân viên" : "Không thể thêm Landlord"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
            <div className="no-results">
              <p>Không tìm thấy người dùng nào</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="staff-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : staffUsers.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <p>Không có nhân viên nào</p>
            </div>
          ) : (
            <div className="staff-table-wrapper">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Ngày sinh</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {staffUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <span className={`role-badge role-${getUserRole(user).toLowerCase()}`}>
                          {getUserRole(user)}
                        </span>
                      </td>
                      <td>{user.dateOfBirth ? formatDate(user.dateOfBirth) : "-"}</td>
                      <td>
                        <span className={`status-badge ${user.statusActive ? "active" : "inactive"}`}>
                          {user.statusActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <button
                          className="remove-role-btn"
                          onClick={() => handleRemoveRole(user)}
                          title="Xóa vai trò"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Remove Role Confirmation Modal */}
      {showRemoveConfirm && userToRemove && (
        <div className="modal-overlay" onClick={() => setShowRemoveConfirm(false)}>
          <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <h2>Xác nhận xóa vai trò</h2>
            </div>
            <div className="confirm-content">
              <p>
                Bạn có chắc chắn muốn xóa vai trò của <strong>{userToRemove.firstName} {userToRemove.lastName}</strong>?
              </p>
              <p className="confirm-note">
                Người dùng sẽ trở thành Tenant sau khi xóa vai trò.
              </p>
            </div>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowRemoveConfirm(false);
                  setUserToRemove(null);
                }}
              >
                Hủy
              </button>
              <button className="btn-confirm" onClick={confirmRemoveRole}>
                Xóa vai trò
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Confirmation Modal */}
      {showAddConfirm && userToAdd && (
        <div className="modal-overlay" onClick={() => setShowAddConfirm(false)}>
          <div className="modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <h2>Xác nhận thêm vai trò</h2>
            </div>
            <div className="confirm-content">
              <p>
                Bạn có chắc chắn muốn thêm vai trò <strong>{roleToAdd}</strong> cho{" "}
                <strong>{userToAdd.firstName} {userToAdd.lastName}</strong>?
              </p>
            </div>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowAddConfirm(false);
                  setUserToAdd(null);
                  setRoleToAdd("");
                }}
              >
                Hủy
              </button>
              <button className="btn-confirm" onClick={confirmAddRole}>
                Thêm vai trò
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementPage;
