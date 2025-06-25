import React from 'react';
import { Typography, Progress } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import { useExercise } from '../../context/ExerciseContext';

const { Title, Text } = Typography;

const StretchProgress = () => {
  const { getCompletedCount, dailyGoal, getProgressPercentage } = useExercise();
  
  const completedStretches = getCompletedCount();
  const totalStretches = dailyGoal;
  const progressPercentage = getProgressPercentage();

  return (
    <div style={{ textAlign: 'center' }}>
      <Title level={5} style={{ marginBottom: 8, fontSize: 13 }}>
        <FireOutlined style={{ color: '#ff7a45', marginRight: 8 }} />
        Session Stretch Goal
      </Title>
      
      <div style={{ marginBottom: 12 }}>
        <Title level={1} style={{ fontSize: '32px', margin: 0, color: '#1890ff' }}>
          {completedStretches}/{totalStretches}
        </Title>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Stretches Completed
        </Text>
      </div>
      
      <Progress
        percent={progressPercentage}
        strokeColor={{
          '0%': '#87d068',
          '100%': '#108ee9',
        }}
        strokeWidth={8}
        showInfo={true}
        format={(percent) => `${percent}%`}
      />
    </div>
  );
};

export default StretchProgress; 