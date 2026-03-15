import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, CheckCircle } from 'lucide-react';
import { authGetAPI } from '../../api/authAPI/GET';
import { authPostAPI } from '../../api/authAPI/POST';
import { mailPostAPI } from '../../api/mailAPI/POST';
import './styles/auth.css';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Landlord' | 'Tenant'>('Tenant');

  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [error, setError] = useState('');

  // OTP verification states
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check form validity
  useEffect(() => {
    const isValid =
      email &&
      !emailError &&
      password &&
      !passwordError &&
      confirmPassword &&
      !confirmPasswordError &&
      phoneNumber &&
      !phoneNumberError &&
      firstName &&
      lastName &&
      selectedRole &&
      emailVerified &&
      emailSent;
    setIsFormValid(!!isValid);
  }, [
    email,
    emailError,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    phoneNumber,
    phoneNumberError,
    firstName,
    lastName,
    selectedRole,
    emailVerified,
    emailSent,
  ]);

  // Validation handlers
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setError('');

    // Reset OTP states when email changes
    setEmailVerified(false);
    setEmailSent(false);
    setUserOtp('');
    setServerOtp('');
    setOtpError('');

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!text) {
      setEmailError('');
      return;
    }

    if (!emailRegex.test(text)) {
      setEmailError('Email không đúng định dạng');
      return;
    }

    setEmailError('');

    debounceRef.current = setTimeout(() => {
      checkEmail(text);
    }, 1000);
  };

  const checkEmail = async (email: string) => {
    try {
      setCheckingEmail(true);
      const response: any = await authGetAPI.checkEmailExists(email);
      if (response.data === true) {
        setEmailError('Email đã tồn tại');
      } else {
        setEmailError('');
        // Automatically send OTP when email is valid and doesn't exist
        await sendVerificationToken(email);
      }
    } catch (error) {
    } finally {
      setCheckingEmail(false);
    }
  };

  const sendVerificationToken = async (email: string) => {
    try {
      const response = await mailPostAPI.verifyEmailTokenForRegister(email);

      if (response.status === 'success') {
        setEmailSent(true);
        setServerOtp(response.data?.token || '');
      } else {
        alert(response.message || 'Không thể gửi mã xác thực');
      }
    } catch (error) {
      alert('Không thể gửi mã xác thực');
    }
  };

  const verifyOtp = () => {
    if (userOtp === serverOtp) {
      setEmailVerified(true);
      setOtpError('');
    } else {
      setEmailVerified(false);
      setOtpError('Mã xác thực không đúng');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError('');
    if (!text) setPasswordError('');
    else if (text.length < 8) setPasswordError('Mật khẩu phải có ít nhất 8 ký tự');
    else setPasswordError('');
  };

  const handleConfirmChange = (text: string) => {
    setConfirmPassword(text);
    setError('');
    if (!text) setConfirmPasswordError('');
    else if (text !== password) setConfirmPasswordError('Mật khẩu không khớp');
    else setConfirmPasswordError('');
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    setError('');
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!text) setPhoneNumberError('');
    else if (!phoneRegex.test(text)) setPhoneNumberError('SĐT phải từ 10-11 số');
    else setPhoneNumberError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Vui lòng kiểm tra lại thông tin đăng ký');
      return;
    }

    setLoading(true);
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phoneNumber: phoneNumber.trim(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
      createdAt: new Date(),
      statusActive: true,
      profilePicture: 'https://via.placeholder.com/150',
      lastLogin: null,
      roleName: selectedRole,
    };

    try {
      const response: any = await authPostAPI.register(userData);
      if (response.status === 'success') {
        alert('Đăng ký tài khoản thành công');
        window.location.href = '/login';
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-large">
        <div className="auth-header">
          <h1>Tạo tài khoản mới 🚀</h1>
          <p>Bắt đầu quản lý nhà trọ thông minh hơn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* First Name & Last Name */}
          <div className="form-row">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Họ
              </label>
              <div className="input-wrapper-with-icon">
                <div className="input-icon">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  className="input-with-icon"
                  placeholder="Nguyễn"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Tên
              </label>
              <div className="input-wrapper-with-icon">
                <input
                  type="text"
                  className="input-with-icon"
                  placeholder="Văn A"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ paddingLeft: '16px' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Email
            </label>
            <div className={`input-wrapper-with-icon ${emailError ? 'error' : ''} ${emailVerified ? 'success' : ''}`}>
              <div className="input-icon">
                <Mail size={18} />
              </div>
              <input
                type="email"
                className="input-with-icon"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                autoCapitalize="none"
                required
              />
              {checkingEmail && (
                <div style={{ paddingRight: '12px' }}>
                  <div className="loading-spinner" style={{ borderColor: '#9ca3af', borderTopColor: 'transparent' }} />
                </div>
              )}
              {emailVerified && (
                <div style={{ paddingRight: '12px', color: '#10b981' }}>
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
            {emailError && (
              <div className="validation-message validation-error">{emailError}</div>
            )}
          </div>

          {/* OTP Verification - Show when email is sent but not verified */}
          {emailSent && !emailVerified && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
                Mã xác thực
              </label>
              <div className="verification-container">
                <div className="verification-input-wrapper">
                  <div className="input-wrapper-with-icon">
                    <input
                      type="text"
                      className="input-with-icon"
                      placeholder="Nhập mã OTP"
                      value={userOtp}
                      onChange={(e) => setUserOtp(e.target.value)}
                      style={{ paddingLeft: '16px' }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="verification-button"
                  onClick={verifyOtp}
                >
                  Xác thực
                </button>
              </div>
              {otpError && (
                <div className="validation-message validation-error">{otpError}</div>
              )}
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Số điện thoại
            </label>
            <div className={`input-wrapper-with-icon ${phoneNumberError ? 'error' : ''}`}>
              <div className="input-icon">
                <Phone size={18} />
              </div>
              <input
                type="tel"
                className="input-with-icon"
                placeholder="0901234567"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={11}
                required
              />
            </div>
            {phoneNumberError && (
              <div className="validation-message validation-error">{phoneNumberError}</div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Ngày sinh
            </label>
            <div className="input-wrapper-with-icon">
              <input
                type="date"
                className="input-with-icon"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                style={{ paddingLeft: '16px' }}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Mật khẩu
            </label>
            <div className={`input-wrapper-with-icon ${passwordError ? 'error' : ''}`}>
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-with-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
              />
              <div className="input-eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {passwordError && (
              <div className="validation-message validation-error">{passwordError}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }}>
              Xác nhận mật khẩu
            </label>
            <div className={`input-wrapper-with-icon ${confirmPasswordError ? 'error' : ''}`}>
              <div className="input-icon">
                <Lock size={18} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="input-with-icon"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => handleConfirmChange(e.target.value)}
                required
              />
              <div className="input-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {confirmPasswordError && (
              <div className="validation-message validation-error">{confirmPasswordError}</div>
            )}
          </div>

          {/* Role Selection */}
          <div className="role-selection">
            <label className="role-selection-label">Vai trò</label>
            <div className="role-options">
              <button
                type="button"
                className={`role-option ${selectedRole === 'Tenant' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('Tenant')}
              >
                Người thuê
              </button>
              <button
                type="button"
                className={`role-option ${selectedRole === 'Landlord' ? 'selected' : ''}`}
                onClick={() => setSelectedRole('Landlord')}
              >
                Chủ trọ
              </button>
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

          {/* Register Button */}
          <button
            type="submit"
            className="auth-button auth-button-primary"
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              'Đăng ký'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-container">
          <div className="divider-line" />
          <span className="divider-text">Hoặc</span>
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

        {/* Login Link */}
        <div className="auth-links">
          <span>Đã có tài khoản?</span>
          <a href="/login">Đăng nhập ngay</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
