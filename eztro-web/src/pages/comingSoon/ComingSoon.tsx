import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Clock } from 'lucide-react';
import './styles/ComingSoon.css';

const ComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <Clock size={80} />
        </div>
        <h1>Sắp ra mắt!</h1>
        <p className="coming-soon-description">
          Tính năng dành cho Tenant và Landlord đang được phát triển.
          <br />
          Vui lòng quay lại sau hoặc sử dụng ứng dụng di động.
        </p>
        <button className="back-home-button" onClick={() => navigate('/')}>
          <Home size={20} />
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
