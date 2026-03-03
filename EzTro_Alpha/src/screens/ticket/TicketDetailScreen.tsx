import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, Send } from 'lucide-react-native';
import { getTicketApi } from '../../api/ticket/ticketapi';
import { postTicketApi } from '../../api/ticket/ticketapi';
import { ITicket } from '../../types/ticket';
import { COLORS } from '../../constants/theme';
import { NavigationProp, MainStackParamList } from '../../navigation/navigation.type';
import { styles } from './styles/TicketDetailScreen.styles';

type TicketDetailRouteProp = RouteProp<MainStackParamList, 'ticketDetailScreen'>;

export const TicketDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TicketDetailRouteProp>();
  const { ticketId } = route.params;

  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const response: any = await getTicketApi.getTicketById(ticketId);
      if (response.status && response.data) {
        const ticketData = response.data.data || response.data;
        setTicket(ticketData);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || sending) return;

    try {
      setSending(true);
      const response: any = await postTicketApi.addReply(ticketId, replyText.trim());
      if (response.status && response.data) {
        setReplyText('');
        loadTicket(); // Reload to show new reply
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.GREEN_PRIMARY;
      case 'processing':
        return '#3B82F6';
      case 'pending':
        return '#F59E0B';
      default:
        return COLORS.GRAY_DARK;
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

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <LinearGradient
          colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.GREEN_PRIMARY} />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaProvider style={styles.container}>
        <LinearGradient
          colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
            <View style={styles.headerSpacer} />
          </View>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy yêu cầu</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết yêu cầu</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView style={styles.content}>
          {/* Ticket Info */}
          <View style={styles.infoCard}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
              <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
            </View>
            
            <Text style={styles.title}>{ticket.title}</Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Cụm trọ:</Text>
              <Text style={styles.metaValue}>
                {typeof ticket.houseId === 'object' && ticket.houseId?.houseName}
              </Text>
            </View>
            
            {ticket.roomId && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Phòng:</Text>
                <Text style={styles.metaValue}>
                  {typeof ticket.roomId === 'object' && ticket.roomId?.roomName}
                </Text>
              </View>
            )}
            
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Loại:</Text>
              <Text style={styles.metaValue}>{ticket.categories.join(', ')}</Text>
            </View>
            
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Ngày tạo:</Text>
              <Text style={styles.metaValue}>
                {new Date(ticket.createdAt).toLocaleString('vi-VN')}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.descriptionLabel}>Mô tả:</Text>
            <Text style={styles.description}>{ticket.description}</Text>
          </View>

          {/* Replies */}
          <View style={styles.repliesSection}>
            <Text style={styles.repliesTitle}>Trao đổi ({ticket.replies?.length || 0})</Text>
            
            {ticket.replies && ticket.replies.length > 0 ? (
              ticket.replies.map((reply, index) => (
                <View key={index} style={styles.replyCard}>
                  <View style={styles.replyHeader}>
                    <Text style={styles.replyAuthor}>
                      {typeof reply.userId === 'object' 
                        ? `${reply.userId.firstName} ${reply.userId.lastName}`
                        : 'User'}
                    </Text>
                    <Text style={styles.replyTime}>
                      {new Date(reply.createdAt).toLocaleString('vi-VN')}
                    </Text>
                  </View>
                  <Text style={styles.replyContent}>{reply.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReplies}>Chưa có trao đổi nào</Text>
            )}
          </View>
        </ScrollView>

        {/* Reply Input */}
        <View style={styles.replyInputContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Nhập phản hồi..."
            placeholderTextColor={COLORS.PLACEHOLDER_GRAY}
            value={replyText}
            onChangeText={setReplyText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!replyText.trim() || sending) && styles.sendButtonDisabled]}
            onPress={handleSendReply}
            disabled={!replyText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : (
              <Send size={20} color={COLORS.WHITE} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};
