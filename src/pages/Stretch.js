import React from 'react';
import { Layout, Typography, Button, Card, Space, List, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, HeartOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Stretch = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  const exercises = [
    {
      title: 'Neck Stretches',
      description: 'Gently rotate your neck in circular motions to relieve tension',
      duration: '2 minutes',
      icon: '🦒'
    },
    {
      title: 'Shoulder Rolls',
      description: 'Roll your shoulders forward and backward to loosen up',
      duration: '1 minute',
      icon: '💪'
    },
    {
      title: 'Wrist Stretches',
      description: 'Extend and flex your wrists to prevent carpal tunnel',
      duration: '1 minute',
      icon: '✋'
    },
    {
      title: 'Stand Up & Walk',
      description: 'Take a short walk around your workspace',
      duration: '3 minutes',
      icon: '🚶'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Deskercise
        </Title>
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={handleBackClick}
          style={{ borderRadius: 6 }}
        >
          Back to Home
        </Button>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={1} style={{ color: '#1890ff', marginBottom: 16 }}>
                  <HeartOutlined style={{ marginRight: 12 }} />
                  Stretch Time!
                </Title>
                <Paragraph style={{ fontSize: 18, color: '#666' }}>
                  Here are some simple exercises you can do right at your desk
                </Paragraph>
              </div>
              
              <List
                itemLayout="horizontal"
                dataSource={exercises}
                renderItem={(item) => (
                  <List.Item style={{ padding: '16px 0' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          style={{ fontSize: 24, backgroundColor: '#f0f0f0' }}
                        >
                          {item.icon}
                        </Avatar>
                      }
                      title={
                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                          {item.title}
                        </Title>
                      }
                      description={
                        <div>
                          <Paragraph style={{ margin: '8px 0', color: '#666' }}>
                            {item.description}
                          </Paragraph>
                          <Space>
                            <ClockCircleOutlined style={{ color: '#52c41a' }} />
                            <span style={{ color: '#52c41a', fontWeight: 500 }}>
                              {item.duration}
                            </span>
                          </Space>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
              
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleBackClick}
                  style={{ 
                    height: 48, 
                    fontSize: 16, 
                    borderRadius: 8,
                    padding: '0 24px'
                  }}
                >
                  Done with Stretches
                </Button>
              </div>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Stretch; 