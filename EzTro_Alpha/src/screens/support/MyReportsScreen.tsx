import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Bug, HelpCircle, Lightbulb } from "lucide-react-native";
import { getReportApi } from "../../api/report/GET";
import { appNavigator } from "../../navigation/navigationActions";
import { styles } from "../../screens/support/styles/MyReportsScreen.styles";

const GRADIENT: [string, string] = ["#10b981", "#14b8a6"];

interface Report {
  _id: string;
  typeReport: "Help" | "Bug" | "Advice";
  title: string;
  description: string;
  createdAt: string;
}

export const MyReportsScreen: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await getReportApi.getMyReports();
      
      if (res.status && res.data) {
        // Backend returns nested structure: {status, message, data, timestamp}
        const responseData = res.data as any;
        const reportsData = Array.isArray(responseData.data) ? responseData.data : [];
        setReports(reportsData);
      }
    } catch (error) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Help":
        return <HelpCircle size={20} color="#3b82f6" />;
      case "Bug":
        return <Bug size={20} color="#ef4444" />;
      case "Advice":
        return <Lightbulb size={20} color="#10b981" />;
      default:
        return <HelpCircle size={20} color="#6b7280" />;
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

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "Help":
        return styles.badgeHelp;
      case "Bug":
        return styles.badgeBug;
      case "Advice":
        return styles.badgeAdvice;
      default:
        return styles.badgeHelp;
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

  return (
    <View style={styles.container}>
      <LinearGradient colors={GRADIENT} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => appNavigator.goBack()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yêu cầu của tôi</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
          ) : reports.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>Chưa có yêu cầu nào</Text>
              <Text style={styles.emptyDesc}>
                Các yêu cầu hỗ trợ của bạn sẽ hiển thị ở đây
              </Text>
            </View>
          ) : (
            reports.map((report) => (
              <TouchableOpacity
                key={report._id}
                style={styles.reportCard}
                onPress={() => appNavigator.goToReportDetailScreen(report._id)}
              >
                <View style={styles.reportHeader}>
                  <View style={[styles.typeBadge, getTypeBadgeStyle(report.typeReport)]}>
                    {getTypeIcon(report.typeReport)}
                    <Text style={styles.typeBadgeText}>{getTypeLabel(report.typeReport)}</Text>
                  </View>
                  <Text style={styles.reportDate}>{formatDate(report.createdAt)}</Text>
                </View>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDescription} numberOfLines={3}>
                  {report.description}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
