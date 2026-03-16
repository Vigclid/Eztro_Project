import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''}`}>
      {label && (
        <label className="input-label" style={{ color: theme.colors.text }}>
          {label}
        </label>
      )}
      <div className="input-container">
        {icon && iconPosition === 'left' && (
          <span className="input-icon input-icon-left" style={{ color: theme.colors.textSecondary }}>
            {icon}
          </span>
        )}
        <input
          className={`input ${icon ? `input-with-icon-${iconPosition}` : ''} ${
            error ? 'input-error' : ''
          } ${className}`}
          style={{
            backgroundColor: theme.colors.background,
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
          }}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="input-icon input-icon-right" style={{ color: theme.colors.textSecondary }}>
            {icon}
          </span>
        )}
      </div>
      {error && (
        <span className="input-message input-error-message" style={{ color: theme.colors.error }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="input-message input-helper-text" style={{ color: theme.colors.textSecondary }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
