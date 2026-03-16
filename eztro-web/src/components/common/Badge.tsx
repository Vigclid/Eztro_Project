import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    const colors = {
      primary: { bg: theme.colors.primary, text: '#ffffff' },
      secondary: { bg: theme.colors.secondary, text: '#ffffff' },
      success: { bg: theme.colors.success, text: '#ffffff' },
      warning: { bg: theme.colors.warning, text: '#ffffff' },
      error: { bg: theme.colors.error, text: '#ffffff' },
      info: { bg: theme.colors.info, text: '#ffffff' },
    };

    return {
      backgroundColor: colors[variant].bg,
      color: colors[variant].text,
    };
  };

  return (
    <span
      className={`badge badge-${size} ${rounded ? 'badge-rounded' : ''} ${className}`}
      style={getVariantStyles()}
    >
      {children}
    </span>
  );
};
