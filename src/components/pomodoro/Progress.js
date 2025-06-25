import React from 'react';
import { Card, Typography, Progress as ProgressBar, Space, Statistic } from 'antd';
import { ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useSession } from '../../context/SessionContext';

const { Title, Text } = Typography;

const Progress = ({ fullHeight }) => {
  const { sessionData, activeSession } = useSession();

  const style = {
    card: {
      width: '100%',
      maxWidth: '500px',
      borderRadius: 24,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      padding: '20px 16px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      height: fullHeight ? '100%' : 'auto',
      minHeight: fullHeight ? '100%' : 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '1.2rem',
      fontWeight: 700
    },
    scrollContent: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px', // Reduced gap to fit all cards
      width: '100%',
      position: 'relative',
      zIndex: 2,
      paddingBottom: '8px',
    },
    statistic: {
      textAlign: 'center',
      padding: '12px 10px', // Reduced padding
      background: 'rgba(16, 185, 129, 0.1)',
      borderRadius: 16,
      border: '1px solid rgba(16, 185, 129, 0.2)',
      minHeight: '80px', // Reduced height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    progressSection: {
      padding: '14px 12px', // Reduced padding
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: 16,
      border: '1px solid rgba(99, 102, 241, 0.2)',
      minHeight: '90px', // Reduced height
    },
    progressTitle: {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#6366f1',
      marginBottom: 8,
      textAlign: 'center'
    },
    progressBar: {
      height: '12px', // Slightly increased height
      borderRadius: '6px'
    },
    noSession: {
      textAlign: 'center',
      padding: '40px 16px', // Increased padding
      color: '#64748b',
      fontSize: '0.95rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    // New styles for better visual hierarchy
    currentCycleCard: {
      textAlign: 'center',
      padding: '14px 10px', // Reduced padding
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
      borderRadius: 16,
      border: '2px solid rgba(16, 185, 129, 0.3)',
      minHeight: '90px', // Reduced height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    completedCyclesCard: {
      textAlign: 'center',
      padding: '12px 10px', // Reduced padding
      background: 'rgba(16, 185, 129, 0.08)',
      borderRadius: 16,
      border: '1px solid rgba(16, 185, 129, 0.2)',
      minHeight: '80px', // Reduced height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    workDurationCard: {
      textAlign: 'center',
      padding: '12px 10px', // Reduced padding
      background: 'rgba(99, 102, 241, 0.08)',
      borderRadius: 16,
      border: '1px solid rgba(99, 102, 241, 0.2)',
      minHeight: '80px', // Reduced height
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }
  };

  if (activeSession !== 'pomodoro' || !sessionData) {
    return (
      <div style={style.card}>
        <Title level={2} style={style.title}>
          Session Progress
        </Title>
        <div style={style.noSession}>
          <ClockCircleOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#94a3b8' }} />
          <Text type="secondary" style={{ fontSize: '16px' }}>No active session</Text>
          <Text type="secondary" style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
            Start a Pomodoro session to track your progress
          </Text>
        </div>
      </div>
    );
  }

  const { currentCycle, totalCycles, cyclesCompleted, workDuration } = sessionData;
  const progressPercentage = totalCycles > 0 ? Math.round((cyclesCompleted / totalCycles) * 100) : 0;

  return (
    <div style={style.card}>
      <Title level={2} style={style.title}>
        <ClockCircleOutlined style={{ marginRight: '12px' }} />
        Session Progress
      </Title>
      <div style={style.scrollContent}>
        {/* Current Cycle - Most prominent */}
        <div style={style.currentCycleCard}>
          <Statistic
            title="Current Cycle"
            value={`${currentCycle}/${totalCycles}`}
            prefix={<TrophyOutlined style={{ color: '#10b981' }} />}
            valueStyle={{ 
              color: '#10b981', 
              fontSize: '30px', // Reduced font size
              fontWeight: 700,
              lineHeight: 1.2
            }}
            titleStyle={{
              fontSize: '15px', // Reduced font size
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '6px'
            }}
          />
        </div>

        {/* Progress Bar */}
        <div style={style.progressSection}>
          <div style={style.progressTitle}>
            Overall Progress
          </div>
          <ProgressBar
            percent={progressPercentage}
            strokeColor={{
              '0%': '#10b981',
              '100%': '#6366f1',
            }}
            strokeWidth={16}
            showInfo={true}
            style={style.progressBar}
            trailColor="rgba(16, 185, 129, 0.1)"
          />
          <div style={{ 
            textAlign: 'center', 
            marginTop: '8px', // Reduced margin
            fontSize: '13px', // Reduced font size
            color: '#64748b',
            fontWeight: 500
          }}>
            {cyclesCompleted} of {totalCycles} cycles completed
          </div>
        </div>

        {/* Secondary Stats */}
        <div style={style.completedCyclesCard}>
          <Statistic
            title="Cycles Completed"
            value={cyclesCompleted}
            suffix={`/ ${totalCycles}`}
            valueStyle={{ 
              color: '#10b981',
              fontSize: '24px', // Reduced font size
              fontWeight: 700,
              lineHeight: 1.2
            }}
            titleStyle={{
              fontSize: '14px', // Reduced font size
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '4px'
            }}
          />
        </div>

        <div style={style.workDurationCard}>
          <Statistic
            title="Work Duration"
            value={Math.round(workDuration / 60)}
            suffix="minutes"
            valueStyle={{ 
              color: '#6366f1',
              fontSize: '24px', // Reduced font size
              fontWeight: 700,
              lineHeight: 1.2
            }}
            titleStyle={{
              fontSize: '14px', // Reduced font size
              fontWeight: 600,
              color: '#1e293b',
              marginBottom: '4px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Progress;