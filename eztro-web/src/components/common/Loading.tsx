import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Loading.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullScreen = false,
  text,
}) => {
  const { theme } = useTheme();

  const spinner = (
    <div className="loading-container">
      <div
        className={`loading-spinner loading-spinner-${size}`}
        style={{ borderTopColor: theme.colors.primary }}
      />
      {text && (
        <p className="loading-text" style={{ color: theme.colors.textSecondary }}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen" style={{ backgroundColor: theme.colors.background }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};
