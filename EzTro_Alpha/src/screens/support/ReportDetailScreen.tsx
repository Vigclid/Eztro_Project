import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Bug, HelpCircle, Lightbulb, Send } from "lucide-react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { getReportApi } from "../../api/report/GET";
import { postReportApi } from "../../api/report/POST";
import { appNavigator } from "../../navigation/navigationActions";
import { MainStackParamList } from "../../navigation/navigation.type";
import { styles } from "./styles/ReportDetailScreen.styles";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";

const GRADIENT: [string, string] = ["#10b981", "#14b8a6"];

type ReportDetailRouteProp = RouteProp<MainStackParamList, "reportDetailScreen">;

interface Reply {
  senderId: {
    _id: string;
    fullName: string;
    email: string;
  };
  message: string;
  createdAt: string;
}

interface Report {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  typeReport: "Help" | "Bug" | "Advice";
  title: string;
  description: string;
  status: "Pending" | "InProgress" | "Resolved" | "Closed";
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export const ReportDetailScreen: React.FC = () => {
  const route = useRoute<ReportDetailRouteProp>();
  const { reportId } = route.params;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  const currentUserId = useSelector((state: RootState) => state.auth.user?._id);

  const fetchReportDetail = async () => {
    try {
      const res = await getReportApi.getReportById(reportId);
      
      if (res.status && res.data) {
        const responseData = res.data as any;
        setReport(responseData.data);
      }
    } catch (error) {
      console.error("Error fetching report detail:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReportDetail();
  }, [reportId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReportDetail();
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    setSending(true);
    try {
      const res = await postReportApi.addReply(reportId, { message: replyMessage.trim() });
      
      if (res.status && res.data) {
        setReplyMessage("");
        fetchReportDetail();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Help":
        return <HelpCircle size={24} color="#3b82f6" />;
      case "Bug":
        return <Bug size={24} color="#ef4444" />;
      case "Advice":
        return <Lightbulb size={24} color="#10b981" />;
      default:
        return <HelpCircle size={24} color="#6b7280" />;
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return styles.statusPending;
      case "InProgress":
        return styles.statusInProgress;
      case "Resolved":
        return styles.statusResolved;
      case "Closed":
        return styles.statusClosed;
      default:
        return styles.statusPending;
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
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={GRADIENT} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => appNavigator.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
          <View style={styles.headerSpacer} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={GRADIENT} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => appNavigator.goBack()}>
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
          <View style={styles.headerSpacer} />
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy yêu cầu</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <LinearGradient colors={GRADIENT} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => appNavigator.goBack()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {/* Report Info Card */}
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              {getTypeIcon(report.typeReport)}
              <Text style={styles.reportType}>{getTypeLabel(report.typeReport)}</Text>
            </View>
            
            <Text style={styles.reportTitle}>{report.title}</Text>
            <Text style={styles.reportDescription}>{report.description}</Text>
            
            <View style={styles.reportMeta}>
              <View style={[styles.statusBadge, getStatusStyle(report.status)]}>
                <Text style={styles.statusText}>{getStatusLabel(report.status)}</Text>
              </View>
              <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userLabel}>Người gửi:</Text>
              <Text style={styles.userName}>{report.userId.fullName}</Text>
            </View>
          </View>

          {/* Replies Section - Chat Style */}
          <View style={styles.repliesSection}>
            <Text style={styles.repliesTitle}>
              Cuộc trò chuyện ({report.replies.length})
            </Text>
            
            {report.replies.length === 0 ? (
              <View style={styles.noRepliesContainer}>
                <Text style={styles.noRepliesText}>Chưa có tin nhắn nào</Text>
              </View>
            ) : (
              report.replies.map((reply, index) => {
                const isMyMessage = reply.senderId._id === currentUserId;
                return (
                  <View
                    key={index}
                    style={[
                      styles.messageContainer,
                      isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
                      ]}
                    >
                      {!isMyMessage && (
                        <Text style={styles.senderName}>{reply.senderId.fullName}</Text>
                      )}
                      <Text
                        style={[
                          styles.messageText,
                          isMyMessage ? styles.myMessageText : styles.otherMessageText,
                        ]}
                      >
                        {reply.message}
                      </Text>
                      <Text
                        style={[
                          styles.messageTime,
                          isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
                        ]}
                      >
                        {formatDate(reply.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>

      {/* Reply Input (All users can reply) */}
      {report.status !== "Closed" && (
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor="#9ca3af"
            value={replyMessage}
            onChangeText={setReplyMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!replyMessage.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSendReply}
            disabled={!replyMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
