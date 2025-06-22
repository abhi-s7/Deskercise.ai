import React from 'react';
import { Modal, Typography, Button } from 'antd';
import { TrophyOutlined, HomeOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CongratulationsModal = ({ 
  visible, 
  onClose, 
  onGoHome, 
  onGoToPomodoro, 
  hasActivePomodoroSession,
  onResetProgress
}) => {
  const handleGoHome = () => {
    // Clear the stretch goal context for the next session
    if (onResetProgress) {
      onResetProgress();
    }
    onGoHome();
  };

  const handleGoToPomodoro = () => {
    // Clear the stretch goal context for the next session
    if (onResetProgress) {
      onResetProgress();
    }
    onGoToPomodoro();
  };

  return (
    <Modal
      open={visible}
      onCancel={null}
      footer={null}
      centered
      width={500}
      closable={false}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <TrophyOutlined 
          style={{ 
            fontSize: '64px', 
            color: '#faad14', 
            marginBottom: '24px' 
          }} 
        />
        
        <Title level={2} style={{ color: '#52c41a', marginBottom: '16px' }}>
          Congratulations! 🎉
        </Title>
        
        <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginBottom: '24px' }}>
          You have completed your daily stretching session!
        </Text>
        
        <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff', display: 'block', marginBottom: '32px' }}>
          +300 points earned! 💪
        </Text>
        
        {hasActivePomodoroSession ? (
          <Button
            type="primary"
            size="large"
            icon={<ClockCircleOutlined />}
            onClick={handleGoToPomodoro}
            style={{ width: '200px' }}
          >
            Back to Pomodoro
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            style={{ width: '200px' }}
          >
            Back to Home
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default CongratulationsModal; 