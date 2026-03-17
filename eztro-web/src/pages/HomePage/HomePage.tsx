import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import './styles/HomePage.css';

const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className={`navbar ${scrollY > 50 ? 'navbar-scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/images/favicon.png" alt="EzTro Logo" className="logo-icon" />
            <span className="logo-text">EzTro</span>
          </div>
          <div className="nav-links">
            <a href="#features">Tính năng</a>
            <a href="#pricing">Gói dịch vụ</a>
            <a href="#about">Về chúng tôi</a>
            <a href="#contact">Liên hệ</a>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <button className="btn-login" onClick={() => navigate('/login')}>Đăng nhập</button>
            <button className="btn-signup" onClick={() => navigate('/register')}>Đăng ký</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Giải pháp quản lý nhà trọ #1 Việt Nam</span>
            </div>
            
            <h1 className="hero-title">
              Quản lý nhà trọ
              <span className="gradient-text"> thông minh</span>
              <br />
              chưa bao giờ dễ dàng đến thế
            </h1>
            
            <p className="hero-description">
              EzTro mang đến giải pháp toàn diện cho chủ nhà trọ và người thuê trọ.
              Quản lý phòng trọ, thanh toán, hóa đơn và hỗ trợ khách hàng - tất cả trong một ứng dụng.
            </p>
            
            <div className="hero-actions">
              <button className="btn-primary">
                <span>Bắt đầu miễn phí</span>
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-demo">
                <span className="play-icon">▶</span>
                <span>Xem demo</span>
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Nhà trọ</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">5K+</div>
                <div className="stat-label">Người dùng</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Hài lòng</div>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="screen-header">
                  <div className="screen-time">9:41</div>
                  <div className="screen-icons">📶 📡 🔋</div>
                </div>
                <div className="screen-content">
                  <div className="app-card card-animate-1">
                    <div className="card-icon">🏘️</div>
                    <div className="card-info">
                      <div className="card-title">Nhà trọ ABC</div>
                      <div className="card-subtitle">15 phòng • 12 đã thuê</div>
                    </div>
                  </div>
                  <div className="app-card card-animate-2">
                    <div className="card-icon">💰</div>
                    <div className="card-info">
                      <div className="card-title">Doanh thu tháng này</div>
                      <div className="card-subtitle">45.000.000 VNĐ</div>
                    </div>
                  </div>
                  <div className="app-card card-animate-3">
                    <div className="card-icon">📊</div>
                    <div className="card-info">
                      <div className="card-title">Báo cáo chi tiết</div>
                      <div className="card-subtitle">Xem thống kê</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-elements">
              <div className="float-card float-1">
                <div className="float-icon">✅</div>
                <div className="float-text">Thanh toán thành công</div>
              </div>
              <div className="float-card float-2">
                <div className="float-icon">🔔</div>
                <div className="float-text">3 thông báo mới</div>
              </div>
              <div className="float-card float-3">
                <div className="float-icon">📈</div>
                <div className="float-text">+25% doanh thu</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Tính năng</span>
            <h2 className="section-title">
              Mọi thứ bạn cần để
              <span className="gradient-text"> quản lý nhà trọ</span>
            </h2>
            <p className="section-description">
              Giải pháp toàn diện với các tính năng mạnh mẽ, giúp bạn tiết kiệm thời gian và tối ưu hiệu quả
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card feature-large">
              <div className="feature-icon-large">🏘️</div>
              <h3>Quản lý nhà trọ & phòng trọ</h3>
              <p>Theo dõi thông tin chi tiết về nhà trọ, phòng trọ, tình trạng phòng và lịch sử thuê trọ một cách dễ dàng</p>
              <div className="feature-image">
                <div className="mock-dashboard">
                  <div className="mock-row">
                    <div className="mock-box"></div>
                    <div className="mock-box"></div>
                  </div>
                  <div className="mock-row">
                    <div className="mock-box"></div>
                    <div className="mock-box"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Hóa đơn & Thanh toán</h3>
              <p>Tạo hóa đơn tự động, theo dõi thanh toán và quản lý công nợ hiệu quả</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Quản lý người thuê</h3>
              <p>Lưu trữ thông tin người thuê, hợp đồng và lịch sử giao dịch đầy đủ</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Hệ thống hỗ trợ</h3>
              <p>Tiếp nhận và xử lý yêu cầu hỗ trợ từ người thuê trọ nhanh chóng</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Thông báo realtime</h3>
              <p>Nhận thông báo tức thời về thanh toán, yêu cầu và sự kiện quan trọng</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Báo cáo & Thống kê</h3>
              <p>Phân tích doanh thu, chi phí và hiệu suất kinh doanh chi tiết</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Ứng dụng di động</h3>
              <p>Quản lý mọi lúc mọi nơi với ứng dụng mobile tiện lợi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Gói dịch vụ</span>
            <h2 className="section-title">
              Chọn gói phù hợp với
              <span className="gradient-text"> quy mô của bạn</span>
            </h2>
            <p className="section-description">
              Linh hoạt, minh bạch và không ràng buộc dài hạn
            </p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <p>Phù hợp cho chủ nhà trọ nhỏ</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">Miễn phí</span>
                <span className="price-period">/tháng</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check-icon">✓</span> Quản lý 1 nhà trọ</li>
                <li><span className="check-icon">✓</span> Tối đa 10 phòng</li>
                <li><span className="check-icon">✓</span> Hóa đơn cơ bản</li>
                <li><span className="check-icon">✓</span> Hỗ trợ email</li>
                <li className="disabled"><span className="check-icon">✗</span> Báo cáo nâng cao</li>
                <li className="disabled"><span className="check-icon">✗</span> API tích hợp</li>
              </ul>
              <button className="btn-pricing">Bắt đầu miễn phí</button>
            </div>
            
            <div className="pricing-card pricing-popular">
              <div className="popular-badge">Phổ biến nhất</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <p>Dành cho chủ nhà trọ chuyên nghiệp</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">299K</span>
                <span className="price-period">/tháng</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check-icon">✓</span> Quản lý 5 nhà trọ</li>
                <li><span className="check-icon">✓</span> Không giới hạn phòng</li>
                <li><span className="check-icon">✓</span> Hóa đơn tự động</li>
                <li><span className="check-icon">✓</span> Hỗ trợ ưu tiên</li>
                <li><span className="check-icon">✓</span> Báo cáo nâng cao</li>
                <li><span className="check-icon">✓</span> Thông báo SMS</li>
              </ul>
              <button className="btn-pricing btn-pricing-primary">Chọn gói này</button>
            </div>
            
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <p>Giải pháp cho doanh nghiệp</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">Liên hệ</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check-icon">✓</span> Không giới hạn nhà trọ</li>
                <li><span className="check-icon">✓</span> Không giới hạn phòng</li>
                <li><span className="check-icon">✓</span> Tùy chỉnh theo yêu cầu</li>
                <li><span className="check-icon">✓</span> Hỗ trợ 24/7</li>
                <li><span className="check-icon">✓</span> API tích hợp</li>
                <li><span className="check-icon">✓</span> Đào tạo riêng</li>
              </ul>
              <button className="btn-pricing">Liên hệ tư vấn</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu với EzTro?</h2>
            <p>Tham gia cùng hàng trăm chủ nhà trọ đang sử dụng EzTro để quản lý kinh doanh hiệu quả hơn</p>
            <div className="cta-actions">
              <button className="btn-cta-primary">
                Dùng thử miễn phí 30 ngày
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-cta-secondary">Đặt lịch tư vấn</button>
            </div>
            <p className="cta-note">Không cần thẻ tín dụng • Hủy bất cứ lúc nào</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="section-container">
          <div className="about-content">
            <div className="about-text">
              <span className="section-badge">Về chúng tôi</span>
              <h2 className="section-title">
                Đồng hành cùng bạn trong
                <span className="gradient-text"> hành trình kinh doanh</span>
              </h2>
              <p className="about-description">
                EzTro được phát triển bởi đội ngũ có nhiều năm kinh nghiệm trong lĩnh vực công nghệ và quản lý bất động sản. 
                Chúng tôi hiểu rõ những khó khăn mà các chủ nhà trọ gặp phải và cam kết mang đến giải pháp tốt nhất.
              </p>
              <div className="about-features">
                <div className="about-feature-item">
                  <div className="feature-number">5+</div>
                  <div className="feature-text">Năm kinh nghiệm</div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-number">24/7</div>
                  <div className="feature-text">Hỗ trợ khách hàng</div>
                </div>
                <div className="about-feature-item">
                  <div className="feature-number">100%</div>
                  <div className="feature-text">Bảo mật dữ liệu</div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="about-card">
                <div className="card-header">
                  <div className="card-avatar">👥</div>
                  <div>
                    <div className="card-title">Đội ngũ chuyên nghiệp</div>
                    <div className="card-subtitle">Luôn sẵn sàng hỗ trợ</div>
                  </div>
                </div>
                <div className="card-stats">
                  <div className="stat-box">
                    <div className="stat-value">98%</div>
                    <div className="stat-label">Khách hàng hài lòng</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-value">&lt;2h</div>
                    <div className="stat-label">Thời gian phản hồi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Liên hệ</span>
            <h2 className="section-title">
              Hãy để chúng tôi
              <span className="gradient-text"> hỗ trợ bạn</span>
            </h2>
            <p className="section-description">
              Đội ngũ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn
            </p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <p>support@eztro.com</p>
                <a href="mailto:support@eztro.com" className="contact-link">Gửi email →</a>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Điện thoại</h3>
                <p>0123 456 789</p>
                <a href="tel:0123456789" className="contact-link">Gọi ngay →</a>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Địa chỉ</h3>
                <p>Hà Nội, Việt Nam</p>
                <a href="#" className="contact-link">Xem bản đồ →</a>
              </div>
              
              <div className="contact-card">
                <div className="contact-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Trò chuyện trực tiếp</p>
                <a href="#" className="contact-link">Bắt đầu chat →</a>
              </div>
            </div>
            
            <div className="contact-form-wrapper">
              <form className="contact-form">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input type="text" placeholder="Nhập họ tên của bạn" />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="email@example.com" />
                </div>
                
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input type="tel" placeholder="0123 456 789" />
                </div>
                
                <div className="form-group">
                  <label>Tin nhắn</label>
                  <textarea rows={4} placeholder="Nội dung tin nhắn..."></textarea>
                </div>
                
                <button type="submit" className="btn-submit">
                  Gửi tin nhắn
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/images/favicon.png" alt="EzTro Logo" className="logo-icon" />
                <span className="logo-text">EzTro</span>
              </div>
              <p className="footer-tagline">
                Giải pháp quản lý nhà trọ thông minh, hiện đại và dễ sử dụng. 
                Giúp bạn tiết kiệm thời gian và tối ưu hiệu quả kinh doanh.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links-wrapper">
              <div className="footer-column">
                <h4>Sản phẩm</h4>
                <a href="#features">Tính năng</a>
                <a href="#pricing">Gói dịch vụ</a>
                <a href="#">Ứng dụng Mobile</a>
                <a href="#">Web Dashboard</a>
                <a href="#">API Documentation</a>
              </div>
              
              <div className="footer-column">
                <h4>Công ty</h4>
                <a href="#about">Về chúng tôi</a>
                <a href="#">Blog</a>
                <a href="#">Tin tức</a>
                <a href="#">Tuyển dụng</a>
                <a href="#">Đối tác</a>
              </div>
              
              <div className="footer-column">
                <h4>Hỗ trợ</h4>
                <a href="#">Trung tâm trợ giúp</a>
                <a href="#">Tài liệu hướng dẫn</a>
                <a href="#">Video tutorials</a>
                <a href="#">Câu hỏi thường gặp</a>
                <a href="#">Liên hệ hỗ trợ</a>
              </div>
              
              <div className="footer-column">
                <h4>Liên hệ</h4>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <a href="mailto:support@eztro.com">support@eztro.com</a>
                </div>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <a href="tel:0123456789">0123 456 789</a>
                </div>
                <div className="contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Hà Nội, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom">
            <p className="copyright">&copy; 2026 EzTro. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Điều khoản sử dụng</a>
              <span className="separator">•</span>
              <a href="#">Chính sách bảo mật</a>
              <span className="separator">•</span>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
