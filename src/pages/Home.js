import React from 'react';
import { Typography, Button, Card, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GiTomato } from "react-icons/gi";
import { PlayCircleOutlined, CalendarOutlined, UserOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [pomodoroHovered, setPomodoroHovered] = React.useState(false);
  const [calendarHovered, setCalendarHovered] = React.useState(false);
  const [stretchHovered, setStretchHovered] = React.useState(false);

  const handleStretchClick = () => {
    navigate('/stretch');
  };

  const style = {
    container: {
      padding: '20px',
      height: '100%',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: 'calc(100vh - 64px)',
      position: 'relative'
    },
    card: (isHovered) => ({
      borderRadius: 24,
      boxShadow: isHovered 
        ? '0 20px 40px rgba(0,0,0,0.15), 0 10px 20px rgba(99, 102, 241, 0.2)' 
        : '0 10px 30px rgba(0,0,0,0.1), 0 4px 8px rgba(99, 102, 241, 0.1)',
      height: '100%',
      textAlign: 'center',
      paddingBlock: 24,
      paddingInline: 20,
      cursor: 'pointer',
      transform: isHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }),
    cardContent: {
      position: 'relative',
      zIndex: 2
    },
    cardBackground: (color) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      zIndex: 1
    }),
    icon: (color) => ({
      fontSize: 64,
      color: color,
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
      transition: 'all 0.3s ease'
    }),
    title: {
      marginBottom: 16,
      fontWeight: 700,
      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    paragraph: {
      color: '#64748b',
      fontSize: '16px',
      lineHeight: '1.6',
      margin: 0
    }
  };

  return (
    <div style={style.container}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: 30,
          padding: '10px 0',
          marginTop: '-10px'
        }}>
          <Title 
            level={1} 
            style={{
              fontSize: '48px',
              fontWeight: 800,
              marginBottom: 16,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease-in-out infinite'
            }}
            className="gradient-text"
          >
            Welcome to Deskercise.ai
          </Title>
          <Paragraph style={{
            fontSize: '20px',
            color: '#64748b',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Your AI-powered companion for productivity and wellness. Choose your mode and start your journey.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              onClick={() => navigate('/pomodoro')}
              style={style.card(pomodoroHovered)}
              onMouseEnter={() => setPomodoroHovered(true)}
              onMouseLeave={() => setPomodoroHovered(false)}
              className="floating"
            >
              <div style={style.cardBackground('#ef4444')} />
              <div style={style.cardContent}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <GiTomato style={style.icon('#ef4444')} />
                  <Title level={3} style={style.title}>
                    Pomodoro Mode
                  </Title>
                  <Paragraph style={style.paragraph}>
                    Focus on your work with timed productivity sessions and AI-powered breaks
                  </Paragraph>
                </Space>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              onClick={() => navigate('/calendar')}
              style={style.card(calendarHovered)}
              onMouseEnter={() => setCalendarHovered(true)}
              onMouseLeave={() => setCalendarHovered(false)}
              className="floating"
            >
              <div style={style.cardBackground('#6366f1')} />
              <div style={style.cardContent}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <CalendarOutlined style={style.icon('#6366f1')} />
                  <Title level={3} style={style.title}>
                    Calendar Mode
                  </Title>
                  <Paragraph style={style.paragraph}>
                    Plan your sessions based on your schedule with intelligent recommendations
                  </Paragraph>
                </Space>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              onClick={handleStretchClick}
              style={style.card(stretchHovered)}
              onMouseEnter={() => setStretchHovered(true)}
              onMouseLeave={() => setStretchHovered(false)}
              className="floating"
            >
              <div style={style.cardBackground('#f59e0b')} />
              <div style={style.cardContent}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <FireOutlined style={style.icon('#f59e0b')} />
                  <Title level={3} style={style.title}>
                    Quick Stretch
                  </Title>
                  <Paragraph style={style.paragraph}>
                    Start an individual stretching session with AI pose detection
                  </Paragraph>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <div style={{ 
          marginTop: 40,
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: 24,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <Title level={2} style={{
            textAlign: 'center',
            marginBottom: 24,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            AI-Powered Features
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                }}>
                  <PlayCircleOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>Smart Timing</Title>
                <Paragraph style={{ color: '#64748b' }}>
                  AI-optimized break intervals based on your work patterns
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                  <UserOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>Pose Detection</Title>
                <Paragraph style={{ color: '#64748b' }}>
                  Real-time AI pose analysis for perfect form guidance
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                }}>
                  <FireOutlined style={{ fontSize: 24, color: 'white' }} />
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>Progress Tracking</Title>
                <Paragraph style={{ color: '#64748b' }}>
                  Gamified experience with points and achievements
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Home;