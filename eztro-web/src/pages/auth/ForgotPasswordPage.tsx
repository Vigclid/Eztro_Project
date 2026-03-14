import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authGetAPI } from '../../api/authAPI/GET';
import { authPostAPI } from '../../api/authAPI/POST';
import './styles/auth.css';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCheckEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const response: any = await authGetAPI.checkEmailExists(email.toLowerCase());
      
      if (response.data === false) {
        setError('Email không tồn tại trong hệ thống');
      } else {
        setSuccess('Email hợp lệ! Vui lòng nhập mật khẩu mới.');
        setStep('reset');
      }
    } catch (err: any) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setLoading(true);
    try {
      const response: any = await authPostAPI.resetPassword({
        email: email.toLowerCase(),
        password,
      });

      if (response.status === 'success') {
        setSuccess('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(response.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Mail Icon Box */}
        <div className="mail-icon-box">
          <Mail size={40} />
        </div>

        <div className="auth-header">
          <h1>Quên mật khẩu</h1>
          <p>
            {step === 'email'
              ? 'Nhập email để đặt lại mật khẩu'
              : 'Nhập mật khẩu mới của bạn'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleCheckEmail} className="auth-form">
            {/* Email Input */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Email
              </label>
              <div className="input-wrapper-with-icon">
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="input-with-icon"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  required
                />
              </div>
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

            {/* Success Message */}
            {success && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#d1fae5', 
                borderRadius: '12px', 
                color: '#065f46',
                fontSize: '14px'
              }}>
                {success}
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              className="auth-button auth-button-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                'Tiếp tục'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            {/* Email (Disabled) */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Email
              </label>
              <div className="input-wrapper-with-icon" style={{ opacity: 0.6 }}>
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  className="input-with-icon"
                  value={email}
                  disabled
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Mật khẩu mới
              </label>
              <div className="input-wrapper-with-icon">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-with-icon"
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Xác nhận mật khẩu
              </label>
              <div className="input-wrapper-with-icon">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-with-icon"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="input-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
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

            {/* Success Message */}
            {success && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#d1fae5', 
                borderRadius: '12px', 
                color: '#065f46',
                fontSize: '14px'
              }}>
                {success}
              </div>
            )}

            {/* Button Group */}
            <div className="button-group">
              <button
                type="button"
                className="auth-button auth-button-ghost"
                onClick={() => {
                  setStep('email');
                  setPassword('');
                  setConfirmPassword('');
                  setError('');
                  setSuccess('');
                }}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="auth-button auth-button-primary"
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner" />
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Login Link */}
        <div className="auth-links">
          <a href="/login">Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
