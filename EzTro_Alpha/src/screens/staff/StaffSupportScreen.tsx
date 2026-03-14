import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Search,
  LifeBuoy,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  MessageSquare,
  Bug,
  HelpCircle,
  Lightbulb,
} from "lucide-react-native";
import { getReportApi } from "../../api/report/GET";
import { appNavigator } from "../../navigation/navigationActions";
import { IReport, IReportStats, ReportStatus, ReportType } from "../../types/report";
import { styles } from "./styles/StaffSupportScreen.styles";

const GRADIENT: [string, string] = ["#10b981", "#14b8a6"];

export const StaffSupportScreen: React.FC = () => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ReportType>("all");
  const [stats, setStats] = useState<IReportStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const fetchReports = async () => {
    try {
      const res = await getReportApi.getAllReports();
      
      if (res.status && res.data) {
        // Backend returns: { status: true, data: { status, message, data: reports[] } }
        const responseData = res.data as any;
        const reportsData = responseData.data as IReport[];
        setReports(reportsData);
        
        // Calculate stats
        const statsData: IReportStats = {
          total: reportsData.length,
          pending: reportsData.filter((r: IReport) => r.status === "Pending").length,
          inProgress: reportsData.filter((r: IReport) => r.status === "InProgress").length,
          resolved: reportsData.filter((r: IReport) => r.status === "Resolved").length,
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.userId.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.typeReport === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case "Help":
        return <HelpCircle size={16} color="#3b82f6" />;
      case "Bug":
        return <Bug size={16} color="#ef4444" />;
      case "Advice":
        return <Lightbulb size={16} color="#10b981" />;
    }
  };

  const getTypeLabel = (type: ReportType) => {
    switch (type) {
      case "Help":
        return "Trợ giúp";
      case "Bug":
        return "Báo lỗi";
      case "Advice":
        return "Góp ý";
    }
  };

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case "Help":
        return { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" };
      case "Bug":
        return { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" };
      case "Advice":
        return { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" };
    }
  };

  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "InProgress":
        return "Đang xử lý";
      case "Resolved":
        return "Đã giải quyết";
      case "Closed":
        return "Đã đóng";
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "Pending":
        return { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" };
      case "InProgress":
        return { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" };
      case "Resolved":
        return { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" };
      case "Closed":
        return { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserFullName = (user: IReport["userId"]) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.email;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={GRADIENT} style={styles.header}>
          <View style={styles.backButton} />
          <Text style={styles.headerTitle}>Phiếu hỗ trợ</Text>
          <View style={styles.backButton} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENT} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => appNavigator.goBack()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phiếu hỗ trợ</Text>
        <View style={styles.backButton} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#d1fae5" }]}>
                <LifeBuoy size={24} color="#10b981" />
              </View>
              <View>
                <Text style={styles.statLabel}>Tổng</Text>
                <Text style={styles.statValue}>{stats.total}</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#fef3c7" }]}>
                <Clock size={24} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.statLabel}>Chờ xử lý</Text>
                <Text style={styles.statValue}>{stats.pending}</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#dbeafe" }]}>
                <AlertCircle size={24} color="#3b82f6" />
              </View>
              <View>
                <Text style={styles.statLabel}>Đang xử lý</Text>
                <Text style={styles.statValue}>{stats.inProgress}</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: "#d1fae5" }]}>
                <CheckCircle size={24} color="#10b981" />
              </View>
              <View>
                <Text style={styles.statLabel}>Đã giải quyết</Text>
                <Text style={styles.statValue}>{stats.resolved}</Text>
              </View>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchBar}>
            <Search size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm phiếu..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filters */}
          <View style={styles.filtersCard}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Trạng thái</Text>
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    statusFilter === "all" && styles.filterButtonActive,
                  ]}
                  onPress={() => setStatusFilter("all")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      statusFilter === "all" && styles.filterButtonTextActive,
                    ]}
                  >
                    Tất cả
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    statusFilter === "Pending" && styles.filterButtonActive,
                  ]}
                  onPress={() => setStatusFilter("Pending")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      statusFilter === "Pending" && styles.filterButtonTextActive,
                    ]}
                  >
                    Chờ xử lý
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    statusFilter === "InProgress" && styles.filterButtonActive,
                  ]}
                  onPress={() => setStatusFilter("InProgress")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      statusFilter === "InProgress" && styles.filterButtonTextActive,
                    ]}
                  >
                    Đang xử lý
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    statusFilter === "Resolved" && styles.filterButtonActive,
                  ]}
                  onPress={() => setStatusFilter("Resolved")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      statusFilter === "Resolved" && styles.filterButtonTextActive,
                    ]}
                  >
                    Đã giải quyết
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    statusFilter === "Closed" && styles.filterButtonActive,
                  ]}
                  onPress={() => setStatusFilter("Closed")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      statusFilter === "Closed" && styles.filterButtonTextActive,
                    ]}
                  >
                    Đã đóng
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Loại yêu cầu</Text>
              <View style={styles.filterButtons}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    typeFilter === "all" && styles.filterButtonActive,
                  ]}
                  onPress={() => setTypeFilter("all")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      typeFilter === "all" && styles.filterButtonTextActive,
                    ]}
                  >
                    Tất cả
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    typeFilter === "Help" && styles.filterButtonActive,
                  ]}
                  onPress={() => setTypeFilter("Help")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      typeFilter === "Help" && styles.filterButtonTextActive,
                    ]}
                  >
                    Trợ giúp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    typeFilter === "Bug" && styles.filterButtonActive,
                  ]}
                  onPress={() => setTypeFilter("Bug")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      typeFilter === "Bug" && styles.filterButtonTextActive,
                    ]}
                  >
                    Báo lỗi
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    typeFilter === "Advice" && styles.filterButtonActive,
                  ]}
                  onPress={() => setTypeFilter("Advice")}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      typeFilter === "Advice" && styles.filterButtonTextActive,
                    ]}
                  >
                    Góp ý
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Reports List */}
          <View style={styles.reportsList}>
            {filteredReports.length === 0 ? (
              <View style={styles.emptyState}>
                <LifeBuoy size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>Không có phiếu nào</Text>
              </View>
            ) : (
              filteredReports.map((report) => {
                const typeColors = getTypeColor(report.typeReport);
                const statusColors = getStatusColor(report.status);
                
                return (
                  <TouchableOpacity
                    key={report._id}
                    style={styles.reportCard}
                    onPress={() => appNavigator.goToReportDetailScreen(report._id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.reportHeader}>
                      <View style={styles.reportBadges}>
                        <View
                          style={[
                            styles.typeBadge,
                            {
                              backgroundColor: typeColors.bg,
                              borderWidth: 2,
                              borderColor: typeColors.border,
                            },
                          ]}
                        >
                          {getTypeIcon(report.typeReport)}
                          <Text
                            style={[styles.typeBadgeText, { color: typeColors.text }]}
                          >
                            {getTypeLabel(report.typeReport)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: statusColors.bg,
                              borderWidth: 2,
                              borderColor: statusColors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[styles.statusBadgeText, { color: statusColors.text }]}
                          >
                            {getStatusLabel(report.status)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.reportTitle} numberOfLines={2}>
                      {report.title}
                    </Text>
                    <Text style={styles.reportDescription} numberOfLines={2}>
                      {report.description}
                    </Text>

                    <View style={styles.reportMeta}>
                      <View style={styles.reportMetaItem}>
                        <User size={16} color="#9ca3af" />
                        <Text style={styles.reportMetaText}>
                          {getUserFullName(report.userId)}
                        </Text>
                        {report.userId.roleName && (
                          <Text style={styles.reportMetaRole}>
                            ({report.userId.roleName})
                          </Text>
                        )}
                      </View>
                      {report.replies.length > 0 && (
                        <View style={styles.reportMetaItem}>
                          <MessageSquare size={16} color="#3b82f6" />
                          <Text style={styles.reportMetaText}>
                            {report.replies.length} phản hồi
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.reportFooter}>
                      <Text style={styles.reportTime}>{formatDate(report.createdAt)}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
