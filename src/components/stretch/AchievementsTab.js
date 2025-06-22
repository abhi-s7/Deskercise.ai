import React from 'react';
import { Typography, List, Space, Tag } from 'antd';
import { TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AchievementsTab = () => {
  const achievements = [
    { name: "First Stretch", description: "Completed your first stretch", earned: true, date: "2024-01-15" },
    { name: "Week Warrior", description: "Completed 7 days of stretching", earned: true, date: "2024-01-22" },
    { name: "Perfect Form", description: "Maintained perfect form for 10 stretches", earned: false },
    { name: "Stretch Master", description: "Completed 100 stretches", earned: false }
  ];

  return (
    <div style={{ padding: '16px 0' }}>
      <Title level={4} style={{ marginBottom: 16 }}>Your Achievements</Title>
      
      <List
        dataSource={achievements}
        renderItem={(item) => (
          <List.Item
            style={{ 
              padding: '12px 0',
              opacity: item.earned ? 1 : 0.6
            }}
          >
            <List.Item.Meta
              avatar={
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: item.earned ? '#52c41a' : '#d9d9d9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.earned ? (
                    <CheckCircleOutlined style={{ color: 'white', fontSize: 20 }} />
                  ) : (
                    <TrophyOutlined style={{ color: '#999', fontSize: 20 }} />
                  )}
                </div>
              }
              title={
                <Space>
                  <Text strong style={{ color: item.earned ? 'inherit' : '#999' }}>
                    {item.name}
                  </Text>
                  {item.earned && <Tag color="green">Earned</Tag>}
                </Space>
              }
              description={
                <div>
                  <Text type="secondary">{item.description}</Text>
                  {item.earned && (
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Earned on {item.date}
                      </Text>
                    </div>
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default AchievementsTab; 