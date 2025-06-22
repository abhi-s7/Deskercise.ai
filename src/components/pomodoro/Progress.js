import React from 'react';
import { Card, Typography, Progress as ProgressBar, Space, Statistic } from 'antd';
import { ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useSession } from '../../context/SessionContext';

const { Title, Text } = Typography;

const Progress = () => {
  const { sessionData, activeSession } = useSession();

  if (activeSession !== 'pomodoro' || !sessionData) {
    return (
      <Card
        title="Session Progress"
        style={{
          width: '40%',
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Text type="secondary">No active session</Text>
      </Card>
    );
  }

  const { currentCycle, totalCycles, cyclesCompleted, workDuration } = sessionData;
  const progressPercentage = totalCycles > 0 ? Math.round((cyclesCompleted / totalCycles) * 100) : 0;

  return (
    <Card
      title={
        <Space>
          <ClockCircleOutlined />
          Session Progress
        </Space>
      }
      style={{
        width: '40%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Statistic
            title="Current Cycle"
            value={`${currentCycle}/${totalCycles}`}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#1890ff', fontSize: '24px' }}
          />
        </div>
        
        <div>
          <Text strong>Overall Progress</Text>
          <ProgressBar
            percent={progressPercentage}
            strokeColor={{
              '0%': '#87d068',
              '100%': '#108ee9',
            }}
            strokeWidth={12}
            showInfo={true}
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <Statistic
            title="Cycles Completed"
            value={cyclesCompleted}
            suffix={`/ ${totalCycles}`}
            valueStyle={{ color: '#52c41a' }}
          />
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <Statistic
            title="Work Duration"
            value={Math.round(workDuration / 60)}
            suffix="minutes"
            valueStyle={{ color: '#722ed1' }}
          />
        </div>
      </Space>
    </Card>
  );
};

export default Progress; 