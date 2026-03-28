import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants/theme';
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
  
  const hasUnread = (conversation.unreadCount || 0) > 0;
  const unreadDisplay = conversation.unreadCount! > 99 ? '99+' : conversation.unreadCount;

  return (
    <TouchableOpacity style={styles.container} onPress={onClick}>
      <View style={styles.avatar}>
        {otherParticipant.profilePicture ? (
          <Image 
            source={{ uri: otherParticipant.profilePicture }} 
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.avatarText}>{initials}</Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, hasUnread && styles.nameUnread]}>
            {otherParticipant.firstName} {otherParticipant.lastName}
          </Text>
          <Text style={styles.time}>{lastMessageTime}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={[styles.preview, hasUnread && styles.previewUnread]} numberOfLines={1}>
            {lastMessagePreview}
          </Text>
          {hasUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadDisplay}</Text>
            </View>
          )}
        </View>
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
    backgroundColor: COLORS.WHITE,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.GRADIENT_START,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.WHITE,
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
  nameUnread: {
    fontWeight: '700',
    color: '#000000',
  },
  time: {
    fontSize: 12,
    color: '#999999',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preview: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  previewUnread: {
    fontWeight: '600',
    color: '#000000',
  },
  badge: {
    backgroundColor: COLORS.GRADIENT_START,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: 11,
    fontWeight: '700',
  },
});
