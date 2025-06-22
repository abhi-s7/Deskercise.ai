import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { themeConfig } from '../../theme/themeConfig';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ showBackButton = false, backButtonText = "Back to Home" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <AntHeader style={{ 
      background: themeConfig.token.colorPrimary, 
      padding: '0 50px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: 64
    }}>
      <Title level={4} style={{ margin: 0, color: '#ffffff', marginLeft: '10px' }}>
        Deskercise
      </Title>
      
      {showBackButton && !isHomePage && (
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{ borderRadius: 6, marginLeft: 'auto' }}
        >
          {backButtonText}
        </Button>
      )}
    </AntHeader>
  );
};

export default Header; 