import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../../stores/store';
import { useChat } from '../../hooks/useChat';
import { useSocket } from '../../hooks/useSocket';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { IMessage } from '../../types/chats';
import { MessageScreenStyles as styles } from './styles/MessageScreen.styles';

interface MessageScreenParams {
  conversationId: string;
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
  const { conversationId } = route.params;
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    messages,
    conversations,
    loading,
    messageCursor,
    loadMessages,
    sendMessage,
    markAsSeen,
  } = useChat();
  const { onReceiveMessage, onUserTyping } = useSocket();
  const [sendingMessage, setSendingMessage] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);

  // Get current conversation
  const conversation = conversations.find((c) => c._id === conversationId);
  const otherParticipant = conversation?.participants.find((p) => p.userId !== user?._id);

  // Load messages on mount
  useEffect(() => {
    loadMessages(conversationId);
    markAsSeen(conversationId);
  }, [conversationId, loadMessages, markAsSeen]);

  // Listen for incoming messages
  useEffect(() => {
    const unsubscribe = onReceiveMessage((message) => {
      if (message.conversationId === conversationId) {
        // Message will be added to state by ChatContext
        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });

    return unsubscribe;
  }, [conversationId, onReceiveMessage]);

  // Listen for typing indicators
  useEffect(() => {
    const unsubscribe = onUserTyping((data) => {
      if (data.conversationId === conversationId) {
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
  }, [conversationId, onUserTyping]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!otherParticipant) return;

      setSendingMessage(true);
      try {
        await sendMessage(otherParticipant.userId, content);
        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setSendingMessage(false);
      }
    },
    [otherParticipant, sendMessage]
  );

  const handleLoadMore = useCallback(() => {
    if (messageCursor && !loading) {
      loadMessages(conversationId, messageCursor);
    }
  }, [conversationId, messageCursor, loading, loadMessages]);

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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#008B8B" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherParticipant?.firstName[0]}
              {otherParticipant?.lastName[0]}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>
              {otherParticipant?.firstName} {otherParticipant?.lastName}
            </Text>
            <Text style={styles.headerStatus}>
              {isTyping ? 'typing...' : 'Active'}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <View style={styles.messagesContainer}>
        {messages.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={renderHeader}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            inverted={false}
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
    </SafeAreaView>
  );
};
