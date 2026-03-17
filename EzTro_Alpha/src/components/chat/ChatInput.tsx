import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSend(content: string): void;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * ChatInput component for composing and sending messages
 * Provides text input field and send button
 * 
 * Props:
 * - onSend: (content: string) => void - Callback when send button is pressed
 * - disabled: boolean - Whether input is disabled
 * - loading: boolean - Whether message is being sent
 */
export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false, loading = false }) => {
  const [content, setContent] = useState('');

  const handleSend = useCallback(() => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    onSend(trimmedContent);
    setContent('');
  }, [content, onSend]);

  const isSendDisabled = disabled || loading || !content.trim();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#999999"
        value={content}
        onChangeText={setContent}
        multiline
        maxLength={5000}
        editable={!disabled && !loading}
      />
      <TouchableOpacity
        style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={isSendDisabled}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="send" size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
    color: '#000000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#008B8B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
});
