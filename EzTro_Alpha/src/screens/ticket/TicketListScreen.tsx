import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  ArrowLeft,
  Plus,
  Wrench,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react-native';
import { getTicketApi } from '../../api/ticket/ticket';
import { ITicket } from '../../types/ticket';
import { COLORS } from '../../constants/theme';
import { NavigationProp } from '../../navigation/navigation.type';
import { styles } from './styles/TicketListScreen.styles';

type FilterType = 'all' | 'pending' | 'processing' | 'completed';

export const TicketListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [filter, setFilter] = useState<FilterType>('all');
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Reload tickets when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTickets();
    }, [])
  );

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response: any = await getTicketApi.getAllTicketsByLandlord();
      
      // apiService wraps the backend response, so we need to access response.data.data
      // Backend returns: { status: "success", data: [...], message: "..." }
      // apiService wraps it: { status: true, data: { status: "success", data: [...] } }
      if (response.status && response.data) {
        // Check if data is already an array or nested in data.data
        const ticketsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [];
        setTickets(ticketsData);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getPriorityColor = (categories: string[]) => {
    if (categories.includes('electrical') || categories.includes('plumbing')) {
      return styles.badgeUrgent;
    }
    return styles.badgeMedium;
  };

  const getPriorityText = (categories: string[]) => {
    if (categories.includes('electrical')) return 'Hệ thống điện';
    if (categories.includes('plumbing')) return 'Hệ thống nước';
    if (categories.includes('furniture')) return 'Đồ đạc';
    if (categories.includes('appliance')) return 'Thiết bị điện';
    if (categories.includes('structure')) return 'Kết cấu';
    return 'Khác';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={COLORS.GREEN_PRIMARY} />;
      case 'processing':
        return <Clock size={20} color="#3B82F6" />;
      case 'pending':
        return <AlertCircle size={20} color="#F59E0B" />;
      default:
        return <Wrench size={20} color={COLORS.GRAY_DARK} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const handleCreateTicket = () => {
    navigation.navigate('mainstack', { screen: 'createTicketScreen' });
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: 'processing' | 'completed') => {
    try {
      await getTicketApi.updateStatus(ticketId, newStatus);
      loadTickets();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const processingCount = tickets.filter((t) => t.status === 'processing').length;
  const completedCount = tickets.filter((t) => t.status === 'completed').length;

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bảo trì & Sửa chữa</Text>
          <TouchableOpacity onPress={handleCreateTicket} style={styles.addButton}>
            <Plus size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statPending}>
            <Text style={styles.statLabelPending}>Chờ xử lý</Text>
            <Text style={styles.statValuePending}>{pendingCount}</Text>
          </View>
          <View style={styles.statProgress}>
            <Text style={styles.statLabelProgress}>Đang xử lý</Text>
            <Text style={styles.statValueProgress}>{processingCount}</Text>
          </View>
          <View style={styles.statCompleted}>
            <Text style={styles.statLabelCompleted}>Hoàn thành</Text>
            <Text style={styles.statValueCompleted}>{completedCount}</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterTabs}
        >
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chờ xử lý' },
            { key: 'processing', label: 'Đang xử lý' },
            { key: 'completed', label: 'Hoàn thành' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key as FilterType)}
              style={[
                styles.filterTab,
                filter === tab.key && styles.filterTabActive,
              ]}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tab.key && styles.filterTabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Ticket List */}
      <ScrollView style={styles.ticketList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.GREEN_PRIMARY} />
          </View>
        ) : filteredTickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Wrench size={48} color={COLORS.GRAY_DARK} />
            <Text style={styles.emptyText}>Chưa có yêu cầu nào</Text>
          </View>
        ) : (
          filteredTickets.map((ticket) => (
            <TouchableOpacity
              key={ticket._id}
              style={styles.ticketCard}
              onPress={() => navigation.navigate('mainstack', {
                screen: 'ticketDetailScreen',
                params: { ticketId: ticket._id }
              })}
              activeOpacity={0.7}
            >
              <View style={styles.ticketHeader}>
                <View style={styles.ticketInfo}>
                  {getStatusIcon(ticket.status)}
                  <View style={styles.ticketTitleContainer}>
                    <Text style={styles.ticketTitle}>{ticket.title}</Text>
                    <Text style={styles.ticketLocation}>
                      {typeof ticket.houseId === 'object' && ticket.houseId?.houseName}
                      {ticket.roomId && ` - Phòng ${typeof ticket.roomId === 'object' && ticket.roomId?.roomName}`}
                    </Text>
                  </View>
                </View>
                <View style={getPriorityColor(ticket.categories)}>
                  <Text style={styles.badgeText}>
                    {getPriorityText(ticket.categories)}
                  </Text>
                </View>
              </View>

              <Text style={styles.ticketDescription} numberOfLines={2}>
                {ticket.description}
              </Text>

              <View style={styles.ticketMeta}>
                <Text style={styles.metaText}>{getStatusText(ticket.status)}</Text>
                <Text style={styles.metaText}>
                  Báo cáo: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>

              {ticket.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus(ticket._id, 'processing');
                    }}
                  >
                    <Text style={styles.startButtonText}>Bắt đầu xử lý</Text>
                  </TouchableOpacity>
                </View>
              )}

              {ticket.status === 'processing' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(ticket._id, 'completed');
                  }}
                >
                  <Text style={styles.completeButtonText}>Đánh dấu hoàn thành</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};
