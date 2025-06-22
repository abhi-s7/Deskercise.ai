import React from 'react';
import { Card } from 'antd';

const PomodoroTimer = () => {
  return (
    <Card
      style={{
        width: '60%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2>Pomodoro Timer</h2>
      {/* Timer content will go here */}
    </Card>
  );
};

export default PomodoroTimer; 