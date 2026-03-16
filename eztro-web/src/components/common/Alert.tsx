import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Alert.css';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  onClose,
  className = '',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    const variants = {
      success: {
        bg: theme.colors.success,
        border: theme.colors.success,
      },
      warning: {
        bg: theme.colors.warning,
        border: theme.colors.warning,
      },
      error: {
        bg: theme.colors.error,
        border: theme.colors.error,
      },
      info: {
        bg: theme.colors.info,
        border: theme.colors.info,
      },
    };

    return variants[variant];
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`alert alert-${variant} ${className}`}
      style={{
        backgroundColor: `${styles.bg}15`,
        borderColor: styles.border,
        color: theme.colors.text,
      }}
    >
      <div className="alert-content">{children}</div>
      {onClose && (
        <button
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
          style={{ color: styles.border }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
