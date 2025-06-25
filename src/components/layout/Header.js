import React from 'react';
import { Layout, Typography, Button, Space, Tag } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, ClockCircleOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { themeConfig } from '../../theme/themeConfig';
import { useSession } from '../../context/SessionContext';
import { useScore } from '../../context/ScoreContext';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = ({ showBackButton = false, backButtonText = "Back to Home" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSession, sessionData } = useSession();
  const { score } = useScore();

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
            style={{ 
              marginLeft: 16, 
              fontSize: '12px', 
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s infinite'
            }}
          >
            Pomodoro Session - Cycle {sessionData.currentCycle}/{sessionData.totalCycles}
          </Tag>
        );
      case 'calendar':
        return (
          <Tag 
            color="green" 
            icon={<CalendarOutlined />}
            style={{ 
              marginLeft: 16, 
              fontSize: '12px', 
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: 'white',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              animation: 'pulse 2s infinite'
            }}
          >
            Calendar Session
          </Tag>
        );
      default:
        return (
          <Tag 
            color="default" 
            style={{ 
              marginLeft: 16, 
              fontSize: '12px', 
              padding: '8px 12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          >
            No Active Session
          </Tag>
        );
    }
  };

  return (
    <AntHeader style={{ 
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
      padding: '0 50px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: 64,
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Title 
        level={4} 
        style={{ 
          margin: 0, 
          color: '#ffffff', 
          marginLeft: '10px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: 700,
          textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          animation: 'gradientShift 3s ease-in-out infinite'
        }}
        className="gradient-text"
      >
        Deskercise.ai
      </Title>
      
      {getSessionDisplay()}
      
      <Tag 
        color="gold" 
        icon={<TrophyOutlined />}
        style={{ 
          marginLeft: 16, 
          fontSize: '12px', 
          padding: '8px 12px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          border: 'none',
          color: 'white',
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          animation: 'glow 2s ease-in-out infinite alternate'
        }}
      >
        Score: {score}
      </Tag>
      
      {showBackButton && !isHomePage && (
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{ 
            borderRadius: 12, 
            marginLeft: 'auto',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          {backButtonText}
        </Button>
      )}
    </AntHeader>
  );
};

export default Header;