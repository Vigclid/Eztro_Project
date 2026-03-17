import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Textarea.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  resize = 'vertical',
  className = '',
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <div className={`textarea-wrapper ${fullWidth ? 'textarea-full-width' : ''}`}>
      {label && (
        <label className="textarea-label" style={{ color: theme.colors.text }}>
          {label}
        </label>
      )}
      <textarea
        className={`textarea textarea-resize-${resize} ${error ? 'textarea-error' : ''} ${className}`}
        style={{
          backgroundColor: theme.colors.background,
          borderColor: error ? theme.colors.error : theme.colors.border,
          color: theme.colors.text,
        }}
        {...props}
      />
      {error && (
        <span className="textarea-message textarea-error-message" style={{ color: theme.colors.error }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="textarea-message textarea-helper-text" style={{ color: theme.colors.textSecondary }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
