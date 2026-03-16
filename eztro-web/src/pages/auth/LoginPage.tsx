import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authPostAPI } from '../../api/authAPI/POST';
import './styles/auth.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation handlers
  const validateEmail = (text: string) => {
    setEmail(text);
    setError('');

    if (text === '') {
      setEmailError('');
      setEmailSuccess('');
      setIsFormValid(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(text)) {
      setEmailSuccess('✓ Email hợp lệ');
      setEmailError('');
      if (password.length >= 8) {
        setIsFormValid(true);
      }
    } else {
      setEmailError('✕ Email không đúng định dạng');
      setEmailSuccess('');
      setIsFormValid(false);
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setError('');

    if (text === '') {
      setPasswordError('');
      setPasswordSuccess('');
      setIsFormValid(false);
      return;
    }

    if (text.length >= 8) {
      setPasswordSuccess('✓ Mật khẩu hợp lệ');
      setPasswordError('');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setIsFormValid(true);
      }
    } else {
      setPasswordError('✕ Mật khẩu phải có ít nhất 8 ký tự');
      setPasswordSuccess('');
      setIsFormValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!isFormValid) {
      setError('Vui lòng kiểm tra lại thông tin');
      return;
    }

    setLoading(true);
    try {
      const response: any = await authPostAPI.login({
        email: email.toLowerCase(),
        password,
        role: '',
      });

      if (response.status === 'success') {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        const roleFromUser = response.data.user?.roleId?.name || response.data.user?.roleName;
        
        // Route based on role
        if (roleFromUser === 'Tenant' || roleFromUser === 'Landlord') {
          window.location.href = '/coming-soon';
        } else if (roleFromUser === 'Staff' || roleFromUser === 'Admin' || roleFromUser === 'staff' || roleFromUser === 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(response.message || 'Email hoặc mật khẩu không đúng');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Chào mừng trở lại! 👋</h1>
          <p>Đăng nhập để tiếp tục quản lý nhà trọ</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Input */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Email
            </label>
            <div className={`input-wrapper-with-icon ${emailError ? 'error' : ''} ${emailSuccess ? 'success' : ''}`}>
              <div className="input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                className="input-with-icon"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                autoCapitalize="none"
              />
            </div>
            {email && (emailError || emailSuccess) && (
              <div className={`validation-message ${emailError ? 'validation-error' : 'validation-success'}`}>
                {emailError || emailSuccess}
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Mật khẩu
            </label>
            <div className={`input-wrapper-with-icon ${passwordError ? 'error' : ''} ${passwordSuccess ? 'success' : ''}`}>
              <div className="input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
              />
              <div className="input-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {password && (passwordError || passwordSuccess) && (
              <div className={`validation-message ${passwordError ? 'validation-error' : 'validation-success'}`}>
                {passwordError || passwordSuccess}
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-container">
            <a href="/forgot-password" className="forgot-password-link">
              Quên mật khẩu?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ 
              padding: '12px 16px', 
              background: '#fee2e2', 
              borderRadius: '12px', 
              color: '#991b1b',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="auth-button auth-button-primary"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-container">
          <div className="divider-line" />
          <span className="divider-text">Hoặc đăng nhập với</span>
          <div className="divider-line" />
        </div>

        {/* Social Buttons */}
        <div className="social-buttons">
          <button type="button" className="social-button">
            <svg width={20} height={20} viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
          <button type="button" className="social-button">
            <svg width={20} height={20} viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </button>
        </div>

        {/* Register Link */}
        <div className="auth-links">
          <span>Chưa có tài khoản?</span>
          <a href="/register">Đăng ký ngay</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
