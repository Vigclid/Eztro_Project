import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Users,
  DollarSign,
  LifeBuoy,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  User,
  Bell,
  Menu,
  Search,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { styles } from "./styles/StaffDashboardScreen.styles";
import { appNavigator } from "../../navigation/navigationActions";
import { getReportApi } from "../../api/report/GET";

const GRADIENT: [string, string] = ["#10b981", "#14b8a6"];

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

export const StaffDashboardScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    users: { total: 0, active: 0 },
    revenue: { total: 0, paid: 0, pending: 0 },
    tickets: { total: 0, open: 0, inProgress: 0, highPriority: 0, resolved: 0 },
    activity: { today: 0, total: 0, uniqueUsers: 0, successRate: 0 },
  });

  const getRoleName = () => {
    if (user?.roleName) return user.roleName;
    if (user?.roleId && typeof user.roleId === "object" && "name" in user.roleId) {
      return (user.roleId as any).name;
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
      // Fetch real report stats
      const reportRes = await getReportApi.getAllReports();
      
      let reportStats = { total: 0, open: 0, inProgress: 0, highPriority: 0, resolved: 0 };
      
      if (reportRes.status && reportRes.data) {
        const responseData = reportRes.data as any;
        const reportsData = responseData.data || [];
        
        reportStats = {
          total: reportsData.length,
          open: reportsData.filter((r: any) => r.status === "Pending").length,
          inProgress: reportsData.filter((r: any) => r.status === "InProgress").length,
          highPriority: 0, // Reports don't have priority, set to 0
          resolved: reportsData.filter((r: any) => r.status === "Resolved").length,
        };
      }

      // TODO: Replace with actual API calls for other stats when backend endpoints are ready
      setStats({
        users: { total: 156, active: 142 },
        revenue: { total: 45000000, paid: 38, pending: 12 },
        tickets: reportStats,
        activity: { today: 234, total: 1847, uniqueUsers: 89, successRate: 94 },
      });
    } catch (error) {
      // Fallback to mock data on error
      setStats({
        users: { total: 156, active: 142 },
        revenue: { total: 45000000, paid: 38, pending: 12 },
        tickets: { total: 0, open: 0, inProgress: 0, highPriority: 0, resolved: 0 },
        activity: { today: 234, total: 1847, uniqueUsers: 89, successRate: 94 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={GRADIENT} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <User size={32} color="#fff" />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Xin chào,</Text>
              <Text style={styles.username}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email?.split('@')[0] || "Staff"}
              </Text>
              <Text style={styles.role}>
                {isAdmin ? "🔐 Quản trị viên" : "👤 Nhân viên"}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => appNavigator.goToUserProfile()}>
              <Menu size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Admin Banner */}
          {isAdmin && (
            <LinearGradient colors={["#a855f7", "#6366f1"]} style={styles.adminBanner}>
              <View style={styles.adminBannerIcon}>
                <Shield size={28} color="#fff" />
              </View>
              <View style={styles.adminBannerContent}>
                <Text style={styles.adminBannerTitle}>Quyền quản trị viên</Text>
                <Text style={styles.adminBannerDesc}>
                  Bạn có quyền truy cập đầy đủ vào các tính năng quản lý hệ thống
                </Text>
              </View>
            </LinearGradient>
          )}

          {/* Stats Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tổng quan hệ thống</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient colors={["#10b981", "#059669"]} style={styles.statIcon}>
                  <Users size={28} color="#fff" />
                </LinearGradient>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Người dùng</Text>
                  <Text style={styles.statValue}>{stats.users.total}</Text>
                  <Text style={styles.statChangePositive}>+{stats.users.active} hoạt động</Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.statIcon}>
                  <DollarSign size={28} color="#fff" />
                </LinearGradient>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Doanh thu</Text>
                  <Text style={styles.statValue}>{(stats.revenue.total / 1000000).toFixed(1)}M</Text>
                  <Text style={styles.statChangePositive}>
                    {stats.revenue.paid}/{stats.revenue.paid + stats.revenue.pending} đã thu
                  </Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <LinearGradient colors={["#3b82f6", "#2563eb"]} style={styles.statIcon}>
                  <LifeBuoy size={28} color="#fff" />
                </LinearGradient>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Hỗ trợ</Text>
                  <Text style={styles.statValue}>{stats.tickets.total}</Text>
                  <Text style={styles.statChangeNegative}>
                    {stats.tickets.inProgress} đang xử lý
                  </Text>
                </View>
              </View>

              <View style={styles.statCard}>
                <LinearGradient colors={["#10b981", "#059669"]} style={styles.statIcon}>
                  <Activity size={28} color="#fff" />
                </LinearGradient>
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>Hoạt động</Text>
                  <Text style={styles.statValue}>{stats.activity.today}</Text>
                  <Text style={styles.statChangePositive}>Hôm nay</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Admin Quick Access */}
          {isAdmin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quản trị viên - Truy cập nhanh</Text>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                  <LinearGradient colors={["#a855f7", "#9333ea"]} style={styles.actionIcon}>
                    <Shield size={24} color="#fff" />
                  </LinearGradient>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Quản lý nhân viên</Text>
                    <Text style={styles.actionDesc}>Tài khoản & phân quyền</Text>
                  </View>
                  <ChevronRight size={24} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                  <LinearGradient colors={["#06b6d4", "#0891b2"]} style={styles.actionIcon}>
                    <Settings size={24} color="#fff" />
                  </LinearGradient>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Cài đặt hệ thống</Text>
                    <Text style={styles.actionDesc}>Cấu hình & tùy chỉnh</Text>
                  </View>
                  <ChevronRight size={24} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                  <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.actionIcon}>
                    <BarChart3 size={24} color="#fff" />
                  </LinearGradient>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>Báo cáo hệ thống</Text>
                    <Text style={styles.actionDesc}>Phân tích & thống kê</Text>
                  </View>
                  <ChevronRight size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Common Quick Access */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isAdmin ? "Quản lý chung" : "Truy cập nhanh"}</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                <LinearGradient colors={["#10b981", "#059669"]} style={styles.actionIcon}>
                  <Users size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Người dùng</Text>
                  <Text style={styles.actionDesc}>Quản lý tài khoản</Text>
                </View>
                <ChevronRight size={24} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                <LinearGradient colors={["#f59e0b", "#d97706"]} style={styles.actionIcon}>
                  <DollarSign size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Thanh toán</Text>
                  <Text style={styles.actionDesc}>Xem giao dịch</Text>
                </View>
                <ChevronRight size={24} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                activeOpacity={0.8}
                onPress={() => appNavigator.goToStaffSupport()}
              >
                <LinearGradient colors={["#3b82f6", "#2563eb"]} style={styles.actionIcon}>
                  <LifeBuoy size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Hỗ trợ</Text>
                  <Text style={styles.actionDesc}>Phiếu yêu cầu</Text>
                </View>
                {stats.tickets.open > 0 && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionBadgeText}>{stats.tickets.open}</Text>
                  </View>
                )}
                <ChevronRight size={24} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                <LinearGradient colors={["#06b6d4", "#0891b2"]} style={styles.actionIcon}>
                  <Activity size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Hoạt động</Text>
                  <Text style={styles.actionDesc}>Lịch sử hệ thống</Text>
                </View>
                <ChevronRight size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Support Tickets Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Phiếu hỗ trợ</Text>
              <TouchableOpacity onPress={() => appNavigator.goToStaffSupport()}>
                <Text style={styles.sectionLink}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ticketsSummary}>
              <View style={styles.ticketStat}>
                <View style={[styles.ticketStatIcon, { backgroundColor: "#fef3c7" }]}>
                  <Clock size={24} color="#f59e0b" />
                </View>
                <View>
                  <Text style={styles.ticketStatValue}>{stats.tickets.open}</Text>
                  <Text style={styles.ticketStatLabel}>Chờ xử lý</Text>
                </View>
              </View>

              <View style={styles.ticketStat}>
                <View style={[styles.ticketStatIcon, { backgroundColor: "#dbeafe" }]}>
                  <TrendingUp size={24} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.ticketStatValue}>{stats.tickets.inProgress}</Text>
                  <Text style={styles.ticketStatLabel}>Đang xử lý</Text>
                </View>
              </View>

              <View style={styles.ticketStat}>
                <View style={[styles.ticketStatIcon, { backgroundColor: "#d1fae5" }]}>
                  <CheckCircle size={24} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.ticketStatValue}>{stats.tickets.resolved}</Text>
                  <Text style={styles.ticketStatLabel}>Đã giải quyết</Text>
                </View>
              </View>

              <View style={styles.ticketStat}>
                <View style={[styles.ticketStatIcon, { backgroundColor: "#e0e7ff" }]}>
                  <LifeBuoy size={24} color="#6366f1" />
                </View>
                <View>
                  <Text style={styles.ticketStatValue}>{stats.tickets.total}</Text>
                  <Text style={styles.ticketStatLabel}>Tổng cộng</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Recent Activity Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
              <TouchableOpacity>
                <Text style={styles.sectionLink}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityStats}>
              <View style={styles.activityStatCard}>
                <View style={styles.activityStatIcon}>
                  <Activity size={24} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.activityStatLabel}>Tổng hoạt động</Text>
                  <Text style={styles.activityStatValue}>{stats.activity.total}</Text>
                </View>
              </View>

              <View style={styles.activityStatCard}>
                <View style={styles.activityStatIcon}>
                  <Users size={24} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.activityStatLabel}>Người dùng hoạt động</Text>
                  <Text style={styles.activityStatValue}>{stats.activity.uniqueUsers}</Text>
                </View>
              </View>

              <View style={styles.activityStatCard}>
                <View style={styles.activityStatIcon}>
                  <CheckCircle size={24} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.activityStatLabel}>Tỷ lệ thành công</Text>
                  <Text style={styles.activityStatValue}>{stats.activity.successRate}%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
