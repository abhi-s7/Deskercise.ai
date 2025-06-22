import React from 'react';
import { Typography, List, Divider } from 'antd';

const { Title, Text, Paragraph } = Typography;

const TipsTab = () => {
  const tips = [
    "Take deep breaths during each stretch",
    "Hold each stretch for 15-30 seconds",
    "Don't bounce - maintain steady pressure",
    "Stop if you feel any pain",
    "Stretch both sides equally",
    "Warm up before intense stretching"
  ];

  return (
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
  );
};

export default TipsTab; 