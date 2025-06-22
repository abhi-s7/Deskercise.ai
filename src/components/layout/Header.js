import React from 'react';
import { Layout, Typography, Button, Space, Tag } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { themeConfig } from '../../theme/themeConfig';
import { useSession } from '../../context/SessionContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ showBackButton = false, backButtonText = "Back to Home" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSession, sessionData } = useSession();

  const handleBackClick = () => {
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  const getSessionDisplay = () => {
    switch (activeSession) {
      case 'pomodoro':
        return (
          <Tag 
            color="blue" 
            icon={<ClockCircleOutlined />}
            style={{ marginLeft: 16, fontSize: '12px', padding: '4px 8px' }}
          >
            Pomodoro Session - Cycle {sessionData.currentCycle}/{sessionData.totalCycles}
          </Tag>
        );
      case 'calendar':
        return (
          <Tag 
            color="green" 
            icon={<CalendarOutlined />}
            style={{ marginLeft: 16, fontSize: '12px', padding: '4px 8px' }}
          >
            Calendar Session
          </Tag>
        );
      default:
        return (
          <Tag 
            color="default" 
            style={{ marginLeft: 16, fontSize: '12px', padding: '4px 8px' }}
          >
            No Active Session
          </Tag>
        );
    }
  };

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
      
      {getSessionDisplay()}
      
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