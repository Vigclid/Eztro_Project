import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface TypingIndicatorProps {
  isTyping: boolean;
  typingUserName?: string;
}

/**
 * TypingIndicator component for showing when other user is typing
 * Displays animated three-dot indicator
 * 
 * Props:
 * - isTyping: boolean - Whether user is typing
 * - typingUserName: string - Name of user who is typing
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isTyping,
  typingUserName = 'User',
}) => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!isTyping) {
      return;
    }

    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 150);
    animateDot(dot3, 300);
  }, [isTyping, dot1, dot2, dot3]);

  if (!isTyping) {
    return null;
  }

  const getDotOpacity = (dot: Animated.Value) => ({
    opacity: dot.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, getDotOpacity(dot1)]} />
          <Animated.View style={[styles.dot, getDotOpacity(dot2)]} />
          <Animated.View style={[styles.dot, getDotOpacity(dot3)]} />
        </View>
      </View>
      <Text style={styles.text}>{typingUserName} is typing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  bubble: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999999',
    marginHorizontal: 2,
  },
  text: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
});
