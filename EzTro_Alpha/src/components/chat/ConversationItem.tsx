import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IConversation } from '../../types/chats';
import { getRelativeTime } from '../../utils/dateFormatter';

interface ConversationItemProps {
  conversation: IConversation;
  currentUserId: string;
  onClick(): void;
}

/**
 * ConversationItem component for displaying a conversation in the list
 * Shows participant info, last message preview, and timestamp
 * 
 * Props:
 * - conversation: IConversation - The conversation to display
 * - currentUserId: string - Current user's ID
 * - onClick: () => void - Callback when conversation is tapped
 */
export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  onClick,
}) => {
  // Get the other participant (not current user)
  const otherParticipant = conversation.participants.find(
    (p) => p.userId !== currentUserId
  );

  if (!otherParticipant) {
    return null;
  }

  const lastMessage = conversation.lastMessage;
  const lastMessagePreview = lastMessage
    ? lastMessage.content.length > 50
      ? lastMessage.content.substring(0, 50) + '...'
      : lastMessage.content
    : 'No messages yet';

  const lastMessageTime = lastMessage
    ? getRelativeTime(new Date(lastMessage.createdAt))
    : '';

  const initials = `${otherParticipant.firstName[0]}${otherParticipant.lastName[0]}`.toUpperCase();

  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {otherParticipant.firstName} {otherParticipant.lastName}
          </Text>
          <Text style={styles.time}>{lastMessageTime}</Text>
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          {lastMessagePreview}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#008B8B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  time: {
    fontSize: 12,
    color: '#999999',
  },
  preview: {
    fontSize: 13,
    color: '#666666',
  },
});
