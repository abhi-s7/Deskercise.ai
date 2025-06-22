import React, { useState } from 'react';
import { Card, Tabs, Typography, List, Button, Space, Progress, Tag, Divider } from 'antd';
import { 
  HeartOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined, 
  BookOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  AudioOutlined
} from '@ant-design/icons';
import VoiceAssistant from './VoiceAssistant';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const StretchTabs = () => {
  const [activeTab, setActiveTab] = useState('1');

  // Sample data for different tabs
  const quickStretches = [
    {
      name: "Neck Rolls",
      duration: "30 seconds",
      description: "Gently roll your head in circular motions",
      difficulty: "Easy",
      category: "Neck"
    },
    {
      name: "Shoulder Shrugs",
      duration: "45 seconds", 
      description: "Raise and lower your shoulders slowly",
      difficulty: "Easy",
      category: "Shoulders"
    },
    {
      name: "Wrist Flexion",
      duration: "30 seconds",
      description: "Bend your wrists up and down gently",
      difficulty: "Easy", 
      category: "Arms"
    },
    {
      name: "Seated Twist",
      duration: "60 seconds",
      description: "Twist your torso while seated",
      difficulty: "Medium",
      category: "Back"
    }
  ];

  const progressData = [
    { name: "Daily Goal", current: 3, target: 5, unit: "stretches" },
    { name: "Weekly Goal", current: 12, target: 20, unit: "stretches" },
    { name: "Monthly Goal", current: 45, target: 80, unit: "stretches" }
  ];

  const achievements = [
    { name: "First Stretch", description: "Completed your first stretch", earned: true, date: "2024-01-15" },
    { name: "Week Warrior", description: "Completed 7 days of stretching", earned: true, date: "2024-01-22" },
    { name: "Perfect Form", description: "Maintained perfect form for 10 stretches", earned: false },
    { name: "Stretch Master", description: "Completed 100 stretches", earned: false }
  ];

  const tips = [
    "Take deep breaths during each stretch",
    "Hold each stretch for 15-30 seconds",
    "Don't bounce - maintain steady pressure",
    "Stop if you feel any pain",
    "Stretch both sides equally",
    "Warm up before intense stretching"
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Card
      title={
        <Space>
          <HeartOutlined />
          <span>Stretch Guide</span>
        </Space>
      }
      style={{
        width: '50%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '8px',
      }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        type="card"
        size="middle"
      >
        <TabPane 
          tab={
            <span>
              <PlayCircleOutlined />
              Quick Stretches
            </span>
          } 
          key="1"
        >
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <List
              dataSource={quickStretches}
              renderItem={(item, index) => (
                <List.Item
                  style={{ 
                    padding: '12px 0',
                    borderBottom: index < quickStretches.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text strong>{item.name}</Text>
                        <Tag color={item.difficulty === 'Easy' ? 'green' : item.difficulty === 'Medium' ? 'orange' : 'red'}>
                          {item.difficulty}
                        </Tag>
                        <Tag color="blue">{item.category}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary">{item.description}</Text>
                        <div style={{ marginTop: 8 }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          <Text type="secondary">{item.duration}</Text>
                        </div>
                      </div>
                    }
                  />
                  <Button type="primary" size="small">
                    Start
                  </Button>
                </List.Item>
              )}
            />
          </div>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Progress
            </span>
          } 
          key="2"
        >
          <div style={{ padding: '16px 0' }}>
            <Title level={4} style={{ marginBottom: 16 }}>Your Stretching Progress</Title>
            
            {progressData.map((item, index) => (
              <div key={index} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>{item.name}</Text>
                  <Text type="secondary">
                    {item.current}/{item.target} {item.unit}
                  </Text>
                </div>
                <Progress 
                  percent={Math.round((item.current / item.target) * 100)} 
                  status={item.current >= item.target ? 'success' : 'active'}
                  strokeColor={item.current >= item.target ? '#52c41a' : '#1890ff'}
                />
              </div>
            ))}

            <Divider />

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" size="large" icon={<PlayCircleOutlined />}>
                Start Today's Stretches
              </Button>
            </div>
          </div>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Achievements
            </span>
          } 
          key="3"
        >
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
        </TabPane>

        <TabPane 
          tab={
            <span>
              <BookOutlined />
              Tips & Guide
            </span>
          } 
          key="4"
        >
          <div style={{ padding: '16px 0' }}>
            <Title level={4} style={{ marginBottom: 16 }}>Stretching Tips</Title>
            
            <List
              dataSource={tips}
              renderItem={(tip, index) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </div>
                    }
                    title={<Text>{tip}</Text>}
                  />
                </List.Item>
              )}
            />

            <Divider />

            <div style={{ backgroundColor: '#f6f6f6', padding: 16, borderRadius: 8 }}>
              <Title level={5} style={{ marginBottom: 12 }}>Why Stretch?</Title>
              <Paragraph style={{ marginBottom: 8 }}>
                Regular stretching helps improve flexibility, reduce muscle tension, 
                and prevent injuries. It's especially important when working at a desk for long hours.
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }}>
                <Text strong>Remember:</Text> Listen to your body and never force a stretch. 
                The goal is to feel a gentle pull, not pain.
              </Paragraph>
            </div>
          </div>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <AudioOutlined />
              Voice Assistant
            </span>
          } 
          key="5"
        >
          <VoiceAssistant />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default StretchTabs; 