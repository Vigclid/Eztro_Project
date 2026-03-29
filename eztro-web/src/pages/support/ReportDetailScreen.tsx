import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bug,
  HelpCircle,
  Lightbulb,
  Send,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import { reportGetAPI } from "../../api/reportAPI/GET";
import { reportPostAPI } from "../../api/reportAPI/POST";
import { reportPatchAPI } from "../../api/reportAPI/PATCH";
import { Report } from "../../types/report";
import socketService from "../../service/socketService";
import "./styles/ReportDetailScreen.css";

const ReportDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // Check role - handle both roleName and roleId.name
  const getRoleName = () => {
    if (currentUser?.roleName) return currentUser.roleName;
    if (currentUser?.roleId && typeof currentUser.roleId === "object" && "name" in currentUser.roleId) {
      return currentUser.roleId.name;
    }
    return "";
  };

  const roleName = getRoleName();
  const isStaffOrAdmin = roleName === "Staff" || roleName === "Admin";
  const isAdmin = roleName === "Admin" || roleName === "admin";

  useEffect(() => {
    if (reportId) {
      loadReportDetail();
      
      // Connect to socket with authentication
      socketService.connect();
      
      // Small delay to ensure socket is connected before joining room
      const timer = setTimeout(() => {
        socketService.joinReportRoom(reportId);
      }, 500);

      // Listen for new replies from other users
      socketService.onReplyAdded(({ reportId: updatedReportId, reply, senderId }) => {
        if (updatedReportId === reportId) {
          // Only add if it's from another user (not from sender)
          if (senderId !== currentUser?._id) {
            setReport((prevReport) => {
              if (!prevReport) return prevReport;
              
              // Check if this reply already exists (to avoid duplicates)
              const replyExists = prevReport.replies.some(
                (r) => r.message === reply.message && 
                       r.senderId._id === reply.senderId._id &&
                       new Date(r.createdAt).getTime() === new Date(reply.createdAt).getTime()
              );
              
              if (replyExists) return prevReport;
              
              return {
                ...prevReport,
                replies: [...prevReport.replies, reply],
              };
            });
          }
        }
      });

      // Listen for status changes
      socketService.onReportStatusChanged(({ reportId: updatedReportId, status }) => {
        if (updatedReportId === reportId) {
          setReport((prevReport) => {
            if (!prevReport) return prevReport;
            return { ...prevReport, status: status as "Pending" | "InProgress" | "Resolved" | "Closed" };
          });
        }
      });

      return () => {
        clearTimeout(timer);
        socketService.leaveReportRoom(reportId);
        socketService.offReplyAdded();
        socketService.offReportStatusChanged();
      };
    }
  }, [reportId]);

  const loadReportDetail = async () => {
    if (!reportId) return;
    setLoading(true);
    try {
      const res = await reportGetAPI.getReportById(reportId);
      if (res.status === "success" && res.data) {
        // Backend returns report object directly in res.data, not res.data.data
        setReport(res.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !reportId) return;

    const messageContent = replyMessage.trim();
    setSending(true);
    
    try {
      // Optimistically add the reply to the UI immediately
      const optimisticReply = {
        senderId: currentUser,
        message: messageContent,
        createdAt: new Date().toISOString(),
      };

      setReport((prevReport) => {
        if (!prevReport) return prevReport;
        return {
          ...prevReport,
          replies: [...prevReport.replies, optimisticReply],
        };
      });

      setReplyMessage("");

      // Send to server
      const res = await reportPostAPI.addReply(reportId, { message: messageContent });
      if (res.status !== "success") {
        // If failed, remove the optimistic reply
        setReport((prevReport) => {
          if (!prevReport) return prevReport;
          return {
            ...prevReport,
            replies: prevReport.replies.slice(0, -1),
          };
        });
        alert("Lỗi khi gửi tin nhắn");
      }
    } catch (error) {
      // Remove optimistic reply on error
      setReport((prevReport) => {
        if (!prevReport) return prevReport;
        return {
          ...prevReport,
          replies: prevReport.replies.slice(0, -1),
        };
      });
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus: "Pending" | "InProgress" | "Resolved" | "Closed") => {
    if (!reportId) return;
    setUpdatingStatus(true);
    try {
      const res = await reportPatchAPI.updateStatus(reportId, { status: newStatus });
      if (res.status === "success") {
        setShowStatusModal(false);
        // Don't need to reload - socket will update in real-time
        // The status will be updated via the socket listener
      } else {
        alert("Không thể cập nhật trạng thái: " + (res.message || "Lỗi không xác định"));
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Help":
        return <HelpCircle size={24} />;
      case "Bug":
        return <Bug size={24} />;
      case "Advice":
        return <Lightbulb size={24} />;
      default:
        return <HelpCircle size={24} />;
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

  const getUserFullName = (user: { firstName?: string; lastName?: string; email: string }) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email;
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

  if (loading) {
    return (
      <div className="report-detail-container">
        <div className="report-header">
          <button className="back-button" onClick={() => navigate("/support")}>
            <ArrowLeft size={24} />
          </button>
          <h1>Chi tiết báo cáo</h1>
          <div style={{ width: "40px" }} />
        </div>
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-detail-container">
        <div className="report-header">
          <button className="back-button" onClick={() => navigate("/support")}>
            <ArrowLeft size={24} />
          </button>
          <h1>Chi tiết báo cáo</h1>
          <div style={{ width: "40px" }} />
        </div>
        <div className="empty-state">
          <p>Không tìm thấy báo cáo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-detail-wrapper">
      <Sidebar user={currentUser} isAdmin={isAdmin} />
      <div className="report-detail-container">
      <div className="report-header">
        <button className="back-button" onClick={() => navigate("/support")}>
          <ArrowLeft size={24} />
        </button>
        <h1>Chi tiết báo cáo</h1>
        <div style={{ width: "40px" }} />
      </div>

      <div className="report-detail-content">
        {/* Report Info Card */}
        <div className="report-info-card">
          <div className="report-info-header">
            <div className="type-badge">
              <span className={`type-icon type-${report.typeReport.toLowerCase()}`}>
                {getTypeIcon(report.typeReport)}
              </span>
              <span>{getTypeLabel(report.typeReport)}</span>
            </div>
            <div className={`status-badge status-${report.status.toLowerCase()}`}>
              {getStatusIcon(report.status)}
              <span>{getStatusLabel(report.status)}</span>
            </div>
          </div>

          <h2 className="report-title">{report.title}</h2>
          <p className="report-description">{report.description}</p>

          <div className="report-info-meta">
            <div className="info-row">
              <span className="info-label">Người gửi:</span>
              <span className="info-value">{getUserFullName(report.userId)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{report.userId.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày gửi:</span>
              <span className="info-value">{formatDate(report.createdAt)}</span>
            </div>
          </div>

          {isStaffOrAdmin && (
            <button className="change-status-btn" onClick={() => setShowStatusModal(true)}>
              <ChevronDown size={18} />
              Đổi trạng thái
            </button>
          )}
        </div>

        {/* Replies Section */}
        <div className="replies-section">
          <h3 className="replies-title">Cuộc trò chuyện ({report.replies.length})</h3>

          {report.replies.length === 0 ? (
            <div className="no-replies">
              <p>Chưa có tin nhắn nào</p>
            </div>
          ) : (
            <div className="messages-list">
              {report.replies.map((reply, index) => {
                const isMyMessage = reply.senderId._id === currentUser?._id;
                return (
                  <div key={index} className={`message-container ${isMyMessage ? "my-message" : "other-message"}`}>
                    <div className="message-bubble">
                      <div className="message-sender">{getUserFullName(reply.senderId)}</div>
                      <div className="message-text">{reply.message}</div>
                      <div className="message-time">{formatDate(reply.createdAt)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply Input */}
        {report.status !== "Closed" && (
          <div className="reply-input-section">
            <div className="reply-input-container">
              <textarea
                className="reply-input"
                placeholder="Nhập tin nhắn..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                maxLength={500}
              />
              <button className="send-button" onClick={handleSendReply} disabled={!replyMessage.trim() || sending}>
                <Send size={20} />
              </button>
            </div>
            <div className="char-count">{replyMessage.length}/500</div>
          </div>
        )}
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Chọn trạng thái</h3>
            <div className="status-options">
              {(["Pending", "InProgress", "Resolved", "Closed"] as const).map((status) => (
                <button
                  key={status}
                  className={`status-option ${report.status === status ? "active" : ""}`}
                  onClick={() => handleUpdateStatus(status)}
                  disabled={updatingStatus}>
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
            <button className="modal-cancel" onClick={() => setShowStatusModal(false)}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ReportDetailScreen;
