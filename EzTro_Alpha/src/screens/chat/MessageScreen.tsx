import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { RootState } from '../../stores/store';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { IMessage } from '../../types/chats';
import { MessageScreenStyles as styles } from './styles/MessageScreen.styles';
import { postChatApi } from '../../api/chat/POST';
import { getChatApi } from '../../api/chat/GET';

interface MessageScreenParams {
  conversationId?: string;
  recipientId?: string;
  recipientName?: string;
}

type MessageScreenNavigationProp = StackNavigationProp<{ messageScreen: MessageScreenParams }, 'messageScreen'>;
type MessageScreenRouteProp = RouteProp<{ messageScreen: MessageScreenParams }, 'messageScreen'>;

/**
 * MessageScreen component
 * Displays messages in a conversation with real-time updates
 * 
 * Features:
 * - Display paginated messages in chronological order
 * - Show participant info in header
 * - Auto-scroll to latest message
 * - Send messages with validation
 * - Mark messages as seen
 * - Show typing indicators
 * - Load older messages on scroll
 */
export const MessageScreen = () => {
  const navigation = useNavigation<MessageScreenNavigationProp>();
  const route = useRoute<MessageScreenRouteProp>();
  const { conversationId, recipientId, recipientName } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    messages,
    conversations,
    loading,
    messageCursor,
    loadMessages,
    loadConversations,
    sendMessage,
    markAsSeen,
  } = useChat();
  const { onReceiveMessage, onUserTyping } = useSocket();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [localConversationId, setLocalConversationId] = useState<string | undefined>(conversationId);
  const flatListRef = useRef<FlatList>(null);

  // Load conversations on mount if not loaded yet
  useEffect(() => {
    if (!conversations || conversations.length === 0) {
            loadConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Check if conversation exists, if not create it when navigating with recipientId
  useEffect(() => {
    const checkAndCreateConversation = async () => {
      // Only check if we have recipientId but no conversationId
      if (recipientId && !conversationId && !creatingConversation) {
                setCreatingConversation(true);
        
        try {
          // First check if conversation already exists
                    const { conversation: existingConv } = await getChatApi.getConversationWithUser(recipientId);
          
          if (existingConv) {
                        setLocalConversationId(existingConv._id);
            // Reload conversations to ensure it's in the list
            await loadConversations();
          } else {
                                    // Create new conversation
            const { conversation: newConv } = await postChatApi.createConversationWithUser(recipientId);
            
            if (newConv) {
                            setLocalConversationId(newConv._id);
              // Reload conversations to get the new one
              await loadConversations();
            } else {
                          }
          }
        } catch (error: any) {
        } finally {
          setCreatingConversation(false);
        }
      }
    };

    checkAndCreateConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientId, conversationId]);

  // Get current conversation - use localConversationId if available
  const effectiveConversationIdParam = localConversationId || conversationId;
  
            // Debug: log all participantIds
  conversations?.forEach((conv, index) => {
      });
  
  const conversation = effectiveConversationIdParam
    ? conversations?.find((c) => c._id === effectiveConversationIdParam)
    : conversations?.find((c) => {
                return c.participantIds?.includes(recipientId || '');
      });
  
    // Get other participant info
  const otherParticipant = conversation
    ? conversation.participants?.find((p) => p.userId !== user?._id)
    : recipientId && recipientName
    ? { userId: recipientId, firstName: recipientName.split(' ')[0] || recipientName, lastName: recipientName.split(' ').slice(1).join(' ') || '' }
    : null;

    const effectiveConversationId = conversation?._id;

  // Load messages when conversation is found or changes
  useEffect(() => {
    if (effectiveConversationId) {
      loadMessages(effectiveConversationId);
      markAsSeen(effectiveConversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveConversationId]); // Run when conversationId changes

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribe = onReceiveMessage((message) => {
      // Message will automatically appear at top of inverted list
    });

    return unsubscribe;
  }, [effectiveConversationId, onReceiveMessage]);

  // Listen for typing indicators
  useEffect(() => {
    if (!effectiveConversationId) return;

    const unsubscribe = onUserTyping((data) => {
      if (data.conversationId === effectiveConversationId) {
        setTypingUsers((prev) => new Set(prev).add(data.userId));

        // Remove typing indicator after 3 seconds
        const timeout = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = new Set(prev);
            next.delete(data.userId);
            return next;
          });
        }, 3000);

        return () => clearTimeout(timeout);
      }
    });

    return unsubscribe;
  }, [effectiveConversationId, onUserTyping]);

  const handleSendMessage = useCallback(
    async (content: string, imageUri?: string) => {
      if (!otherParticipant) return;
      if (!effectiveConversationId) {
        return;
      }

      setSendingMessage(true);
      try {
        let imageBase64: string | undefined;
        
        // If there's an image, convert to base64
        if (imageUri) {
          const base64 = await convertImageToBase64(imageUri);
          if (base64) {
            imageBase64 = base64;
          } else {
            Alert.alert('Lỗi', 'Không thể xử lý ảnh');
            return;
          }
        }
        
        // Send message with or without image
        const messageContent = imageBase64 ? (content || '') : content;
        await sendMessage(otherParticipant.userId, messageContent, imageBase64);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể gửi tin nhắn');
      } finally {
        setSendingMessage(false);
      }
    },
    [otherParticipant, sendMessage, effectiveConversationId]
  );

  // Helper function to convert image URI to base64
  const convertImageToBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  };

  const handleLoadMore = useCallback(() => {
    if (effectiveConversationId && messageCursor && !loading) {
      loadMessages(effectiveConversationId, messageCursor);
    }
  }, [effectiveConversationId, messageCursor, loading, loadMessages]);

  const renderMessage = useCallback(
    ({ item }: { item: IMessage }) => (
      <MessageBubble message={item} isOwn={item.senderId === user?._id} />
    ),
    [user?._id]
  );

  const renderHeader = () => {
    if (!messageCursor) {
      return null;
    }

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#008B8B" />
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
        <Text style={styles.loadMoreButtonText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No messages yet</Text>
    </View>
  );

  const isTyping = typingUsers.size > 0;
  const typingUserName = otherParticipant?.firstName || 'User';

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.container}>
      {/* Header with gradient - extends to safe area */}
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={COLORS.WHITE} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <View style={styles.avatar}>
                {otherParticipant?.profilePicture ? (
                  <Image 
                    source={{ uri: otherParticipant.profilePicture }} 
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {otherParticipant?.firstName?.[0] || '?'}
                    {otherParticipant?.lastName?.[0] || ''}
                  </Text>
                )}
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>
                  {otherParticipant?.firstName || ''} {otherParticipant?.lastName || ''}
                </Text>
                <Text style={styles.headerStatus}>
                  {isTyping ? 'typing...' : 'Active'}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            ListFooterComponent={renderHeader}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            inverted={true}
            contentContainerStyle={styles.messagesList}
          />
        )}
      </View>

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator isTyping={true} typingUserName={typingUserName} />}

      {/* Chat Input */}
      <View style={styles.inputContainer}>
        <ChatInput onSend={handleSendMessage} disabled={!otherParticipant} loading={sendingMessage} />
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};
