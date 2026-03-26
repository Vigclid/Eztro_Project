import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import * as XLSX from "xlsx";
import Sidebar from "../../components/dashboard/Sidebar";
import { logsGetAPI } from "../../api/logsAPI/GET";
import { AppLog } from "../../types/common";
import "./styles/WebLogPage.css";

const WebLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filters
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    method: "",
    status: "",
    minDuration: "",
    maxDuration: "",
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
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await logsGetAPI.getAllLogs(filters) as any;
      if (res.status === "success" && res.data) {
        const logsArray = Array.isArray(res.data) ? res.data : [];
        setLogs(logsArray);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "success";
    if (status >= 300 && status < 400) return "redirect";
    if (status >= 400 && status < 500) return "client-error";
    return "server-error";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "method-get";
      case "POST": return "method-post";
      case "PUT": return "method-put";
      case "DELETE": return "method-delete";
      case "PATCH": return "method-patch";
      default: return "method-default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const filteredLogs = logs.filter((log) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.meta.url.toLowerCase().includes(searchLower) ||
      log.meta.ip.includes(searchTerm) ||
      log.meta.method.toLowerCase().includes(searchLower)
    );
  });

  // Sort logs by date
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Pagination
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadLogsWithFilters(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      method: "",
      status: "",
      minDuration: "",
      maxDuration: "",
    });
    setSearchTerm("");
    setCurrentPage(1);
    const emptyFilters = {
      startDate: "",
      endDate: "",
      method: "",
      status: "",
      minDuration: "",
      maxDuration: "",
    };
    loadLogsWithFilters(emptyFilters);
  };

  const loadLogsWithFilters = async (filtersToUse: any) => {
    setLoading(true);
    try {
      const res = await logsGetAPI.getAllLogs(filtersToUse) as any;
      if (res.status === "success" && res.data) {
        const logsArray = Array.isArray(res.data) ? res.data : [];
        setLogs(logsArray);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (filteredLogs.length === 0) {
      alert("No data to export");
      return;
    }

    const excelData = filteredLogs.map((log) => ({
      "Date/Time": formatDate(log.timestamp),
      "HTTP Method": log.meta.method,
      "Status Code": log.meta.status,
      "URL": log.meta.url,
      "IP Address": log.meta.ip,
      "Duration (ms)": log.meta.response_time,
      "Origin": log.meta.origin,
      "Host": log.meta.host,
      "User Agent": log.meta.userAgent,
      "Level": log.level,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");

    const columnWidths = [
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 40 },
      { wch: 10 },
    ];
    worksheet["!cols"] = columnWidths;

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `web-logs-${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  const isFilterActive = () => {
    return (
      filters.startDate ||
      filters.endDate ||
      filters.method ||
      filters.status ||
      filters.minDuration ||
      filters.maxDuration ||
      searchTerm
    );
  };

  return (
    <div className="weblog-wrapper">
      <Sidebar user={currentUser} isAdmin={isAdmin} />
      <div className="weblog-container">
        {/* Header */}
        <div className="weblog-header">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={24} />
          </button>
          <h1>Web Log</h1>
          <div style={{ width: "40px" }} />
        </div>

        {/* Filters */}
        <div className="weblog-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Start date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>End date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>User name</label>
              <input type="text" placeholder="Username" />
            </div>
            <div className="filter-group">
              <label>URL</label>
              <input
                type="text"
                placeholder="URL"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Min. duration</label>
              <input
                type="number"
                placeholder="ms"
                value={filters.minDuration}
                onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>Max. duration</label>
              <input
                type="number"
                placeholder="ms"
                value={filters.maxDuration}
                onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>HTTP method</label>
              <select
                value={filters.method}
                onChange={(e) => setFilters({ ...filters, method: e.target.value })}
              >
                <option value="">-</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div className="filter-group">
              <label>HTTP status code</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">-</option>
                <option value="200">200</option>
                <option value="201">201</option>
                <option value="400">400</option>
                <option value="401">401</option>
                <option value="403">403</option>
                <option value="404">404</option>
                <option value="500">500</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Application name</label>
              <input type="text" placeholder="App name" />
            </div>
            <div className="filter-group">
              <label>Client IP Address</label>
              <input type="text" placeholder="IP" />
            </div>
            <div className="filter-group">
              <label>Correlation Id</label>
              <input type="text" placeholder="ID" />
            </div>
            <div className="filter-group">
              <label>Has exception</label>
              <select>
                <option value="">-</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-refresh" onClick={handleApplyFilters}>
              Refresh
            </button>
            {isFilterActive() && (
              <button className="btn-reset" onClick={handleResetFilters}>
                Reset
              </button>
            )}
            <button className="btn-export" onClick={handleExportExcel}>
              <Download size={18} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="weblog-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Đang tải logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <p>Không tìm thấy logs nào</p>
            </div>
          ) : (
            <div className="logs-table-wrapper">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>HTTP REQUEST</th>
                    <th>USER</th>
                    <th>IP ADDRESS</th>
                    <th>
                      <button
                        className="sort-header-btn"
                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        title={`Sort ${sortOrder === "desc" ? "ascending" : "descending"}`}
                      >
                        DATE
                        {sortOrder === "desc" ? (
                          <ArrowDown size={14} />
                        ) : (
                          <ArrowUp size={14} />
                        )}
                      </button>
                    </th>
                    <th>DURATION</th>
                    <th>APPLICATION NAME</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log._id} className="log-row">
                      <td>
                        <div className="http-request">
                          <span className={`method-badge ${getMethodColor(log.meta.method)}`}>
                            {log.meta.method}
                          </span>
                          <span className={`status-badge ${getStatusColor(log.meta.status)}`}>
                            {log.meta.status}
                          </span>
                          <span className="url">{log.meta.url}</span>
                        </div>
                      </td>
                      <td className="text-muted">-</td>
                      <td>{log.meta.ip}</td>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>{log.meta.response_time}ms</td>
                      <td className="text-muted">Volo.AppCommercialDemo.HttpApi.Host</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredLogs.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pagination-info">
              Page {currentPage} of {totalPages} ({filteredLogs.length} items)
            </div>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default WebLogPage;
