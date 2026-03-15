import React from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Card.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
  shadow = 'md',
  style,
  ...rest
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`card card-padding-${padding} card-shadow-${shadow} ${
        hoverable ? 'card-hoverable' : ''
      } ${onClick ? 'card-clickable' : ''} ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.text,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...rest }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`card-header ${className}`}
      style={{ borderColor: theme.colors.border }}
      {...rest}
    >
      {children}
    </div>
  );
};

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...rest }) => {
  return <div className={`card-body ${className}`} {...rest}>{children}</div>;
};

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...rest }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`card-footer ${className}`}
      style={{ borderColor: theme.colors.border }}
      {...rest}
    >
      {children}
    </div>
  );
};
