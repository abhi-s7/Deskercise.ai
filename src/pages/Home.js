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
    card: (isHovered) => ({
      borderRadius: 16,
      boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.1)',
      height: '100%',
      textAlign: 'center',
      paddingBlock: 32,
      paddingInline: 24,
      cursor: 'pointer',
      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      transition: 'all 0.3s ease',
    })
  };

  return (
    <div style={{ padding: '50px', height: '100%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              onClick={() => navigate('/pomodoro')}
              style={style.card(pomodoroHovered)}
              onMouseEnter={() => setPomodoroHovered(true)}
              onMouseLeave={() => setPomodoroHovered(false)}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <GiTomato fontSize={48} />
                <Title level={3} style={{ marginBottom: 0 }}>
                  Pomodoro Mode
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  Focus on your work with timed productivity sessions
                </Paragraph>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              onClick={() => navigate('/calendar')}
              style={style.card(calendarHovered)}
              onMouseEnter={() => setCalendarHovered(true)}
              onMouseLeave={() => setCalendarHovered(false)}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <CalendarOutlined style={{ fontSize: 48, color: 'var(--ant-color-primary)' }} />
                <Title level={3} style={{ marginBottom: 0 }}>
                  Calendar Mode
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  Plan your sessions based on your schedule
                </Paragraph>
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <Card 
              hoverable
              onClick={handleStretchClick}
              style={style.card(stretchHovered)}
              onMouseEnter={() => setStretchHovered(true)}
              onMouseLeave={() => setStretchHovered(false)}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <FireOutlined style={{ fontSize: 48, color: '#ff7a45' }} />
                <Title level={3} style={{ marginBottom: 0 }}>
                  Quick Stretch
                </Title>
                <Paragraph style={{ color: '#666' }}>
                  Start an individual stretching session
                </Paragraph>
              </Space>
            </Card>
          </Col>
          
         
        </Row>
      </div>
    </div>
  );
};

export default Home; 