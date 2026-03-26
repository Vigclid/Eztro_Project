import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../../constants/theme';
import { IMessage } from '../../types/chats';
import { formatTime } from '../../utils/dateFormatter';

interface MessageBubbleProps {
  message: IMessage;
  isOwn: boolean;
}

/**
 * MessageBubble component for rendering individual messages
 * Supports text and image messages
 * 
 * Props:
 * - message: IMessage - The message to display
 * - isOwn: boolean - Whether this is the current user's message
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const styles = getStyles(isOwn);
  const isImage = message.type === 'image';
  const imageUrl = isImage ? message.content : null;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {isImage && imageUrl ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.messageImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <Text style={styles.content}>{message.content}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formatTime(new Date(message.createdAt))}</Text>
          {isOwn && <Text style={styles.status}>{getStatusIcon(message.status)}</Text>}
        </View>
      </View>
    </View>
  );
};

/**
 * Get status icon based on message status
 */
function getStatusIcon(status: string): string {
  switch (status) {
    case 'sent':
      return '✓';
    case 'delivered':
      return '✓✓';
    case 'read':
      return '✓✓';
    default:
      return '';
  }
}

/**
 * Get styles based on whether message is own or other's
 */
function getStyles(isOwn: boolean) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginVertical: 4,
      marginHorizontal: 12,
    },
    bubble: {
      maxWidth: '80%',
      backgroundColor: isOwn ? COLORS.GRADIENT_START : '#E0E0E0',
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    imageContainer: {
      marginBottom: 4,
    },
    messageImage: {
      width: 200,
      height: 200,
      borderRadius: 8,
    },
    content: {
      fontSize: 14,
      color: isOwn ? COLORS.WHITE : '#000000',
      marginBottom: 4,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    timestamp: {
      fontSize: 11,
      color: isOwn ? 'rgba(255, 255, 255, 0.7)' : '#999999',
      marginRight: 4,
    },
    status: {
      fontSize: 11,
      color: isOwn ? 'rgba(255, 255, 255, 0.7)' : '#999999',
    },
  });
}
