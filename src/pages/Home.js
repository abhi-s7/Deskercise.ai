import React from 'react';
import { Layout, Typography, Button, Card, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const handleStretchClick = () => {
    navigate('/stretch');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Title level={2} style={{ margin: '16px 0', color: '#1890ff' }}>
          Deskercise
        </Title>
      </Header>
      
      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Card style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={1} style={{ color: '#1890ff', marginBottom: 0 }}>
                Welcome to Deskercise
              </Title>
              
              <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 32 }}>
                Take care of your health while working at your desk. 
                Simple exercises and stretches to keep you active and energized throughout the day.
              </Paragraph>
              
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleStretchClick}
                style={{ 
                  height: 56, 
                  fontSize: 18, 
                  borderRadius: 8,
                  padding: '0 32px'
                }}
              >
                Start Stretching
              </Button>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Home; 