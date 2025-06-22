import React from 'react';
import { Typography, Progress, Button, Divider } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ProgressTab = () => {
  const progressData = [
    { name: "Daily Goal", current: 3, target: 5, unit: "stretches" },
    { name: "Weekly Goal", current: 12, target: 20, unit: "stretches" },
    { name: "Monthly Goal", current: 45, target: 80, unit: "stretches" }
  ];

  return (
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
  );
};

export default ProgressTab; 