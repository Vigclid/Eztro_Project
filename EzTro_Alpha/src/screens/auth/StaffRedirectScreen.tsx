import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ExternalLink, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../features/auth/authSlice';
import { AppDispatch } from '../../stores/store';
import { COLORS } from '../../constants/theme';

export const StaffRedirectScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const handleGoToWeb = async () => {
    const webUrl = 'http://localhost:5173'; // TODO: Change to production URL
    const canOpen = await Linking.canOpenURL(webUrl);
    if (canOpen) {
      await Linking.openURL(webUrl);
    }
  };

  const handleBackToLogin = async () => {
    await dispatch(logoutAsync());
    navigation.reset({
      index: 0,
      routes: [{ name: 'auth' as never }],
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.GRADIENT_START, COLORS.GRADIENT_END]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <ExternalLink size={80} color={COLORS.WHITE} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Chào mừng Staff/Admin!</Text>

          {/* Message */}
          <Text style={styles.message}>
            Vui lòng truy cập trang web Eztro.com.vn để tiếp tục công việc của bạn.
          </Text>

          <Text style={styles.subMessage}>
            Ứng dụng mobile chỉ dành cho Chủ trọ và Người thuê.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGoToWeb}
              activeOpacity={0.8}
            >
              <ExternalLink size={20} color={COLORS.GRADIENT_START} />
              <Text style={styles.primaryButtonText}>Đi tới trang web</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleBackToLogin}
              activeOpacity={0.8}
            >
              <LogOut size={20} color={COLORS.WHITE} />
              <Text style={styles.secondaryButtonText}>Quay lại đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.WHITE,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  subMessage: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.GRADIENT_START,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});
