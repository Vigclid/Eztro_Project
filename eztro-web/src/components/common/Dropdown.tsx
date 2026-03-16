import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import './styles/Dropdown.css';

interface DropdownOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-wrapper ${fullWidth ? 'dropdown-full-width' : ''} ${className}`}
    >
      {label && (
        <label className="dropdown-label" style={{ color: theme.colors.text }}>
          {label}
        </label>
      )}
      <div className="dropdown-container">
        <button
          type="button"
          className={`dropdown-trigger ${error ? 'dropdown-error' : ''} ${
            disabled ? 'dropdown-disabled' : ''
          }`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          style={{
            backgroundColor: theme.colors.background,
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: selectedOption ? theme.colors.text : theme.colors.textSecondary,
          }}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <span className={`dropdown-arrow ${isOpen ? 'dropdown-arrow-open' : ''}`}>▼</span>
        </button>
        {isOpen && (
          <div
            className="dropdown-menu"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              boxShadow: theme.shadows.lg,
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-option ${
                  option.value === value ? 'dropdown-option-selected' : ''
                } ${option.disabled ? 'dropdown-option-disabled' : ''}`}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                style={{
                  color: theme.colors.text,
                  backgroundColor:
                    option.value === value ? `${theme.colors.primary}15` : 'transparent',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <span className="dropdown-error-message" style={{ color: theme.colors.error }}>
          {error}
        </span>
      )}
    </div>
  );
};
