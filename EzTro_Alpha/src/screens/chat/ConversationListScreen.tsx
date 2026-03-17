import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores/store';
import { useChat } from '../../hooks/useChat';
import { ConversationItem } from '../../components/chat/ConversationItem';
import { IConversation } from '../../types/chats';
import { ConversationListScreenStyles as styles } from './styles/ConversationListScreen.styles';

interface ConversationListScreenProps {
  navigation: StackNavigationProp<any, 'ConversationList'>;
}

/**
 * ConversationListScreen component
 * Displays list of conversations with search and pagination
 * 
 * Features:
 * - Display paginated list of conversations
 * - Search conversations by participant name
 * - Load more conversations on scroll
 * - Show connection status indicator
 * - Navigate to MessageScreen on conversation tap
 */
export const ConversationListScreen: React.FC<ConversationListScreenProps> = ({ navigation }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { conversations, loading, isConnected, loadConversations, conversationCursor } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<IConversation[]>([]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = conversations.filter((conv) => {
      const participant = conv.participants.find((p) => p.userId !== user?._id);
      if (!participant) return false;

      const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredConversations(filtered);
  }, [searchQuery, conversations, user?._id]);

  const handleConversationPress = useCallback(
    (conversation: IConversation) => {
      navigation.navigate('Messages', {
        conversationId: conversation._id,
      });
    },
    [navigation]
  );

  const handleLoadMore = useCallback(() => {
    if (conversationCursor && !loading) {
      loadConversations(conversationCursor);
    }
  }, [conversationCursor, loading, loadConversations]);

  const renderConversation = useCallback(
    ({ item }: { item: IConversation }) => (
      <ConversationItem
        conversation={item}
        currentUserId={user?._id || ''}
        onClick={() => handleConversationPress(item)}
      />
    ),
    [user?._id, handleConversationPress]
  );

  const renderFooter = () => {
    if (!conversationCursor) return null;

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
      <Text style={styles.emptyText}>
        {searchQuery ? 'No conversations found' : 'No conversations yet'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Connection Status */}
      {!isConnected && (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionStatusText}>Connecting...</Text>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        style={styles.listContainer}
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};
