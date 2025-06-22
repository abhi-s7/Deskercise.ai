import React from 'react';
import { Modal, Typography } from 'antd';

const { Text } = Typography;

const StretchModal = ({ 
  visible, 
  onGoToStretch, 
  onSkip, 
  currentCycle, 
  totalCycles 
}) => {
  return (
    <Modal
      title="Pomodoro Cycle Complete! 🎉"
      open={visible}
      onOk={onGoToStretch}
      onCancel={onSkip}
      okText="Go to Stretch"
      cancelText="Skip for Now"
      centered
      closable={false}
      maskClosable={false}
    >
      <p>Cycle {currentCycle} of {totalCycles} completed. Time for a stretch!</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Taking a short break with some stretches can help improve your productivity and reduce strain.
      </p>
    </Modal>
  );
};

export default StretchModal; 