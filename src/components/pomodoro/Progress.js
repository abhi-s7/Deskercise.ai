import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const Progress = () => {
  return (
    <Card
      title="Session Progress"
      style={{
        width: '40%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: '8px',
      }}
    >
      {/* Progress content will be added here in the future */}
    </Card>
  );
};

export default Progress; 