import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const PomodoroSettings = ({ onConfirm, fullHeight }) => {
  const [form] = Form.useForm();
  const [workDuration, setWorkDuration] = useState(1500);

  const onFinish = (values) => {
    onConfirm(values);
  };

  const handleWorkDurationChange = (value) => {
    setWorkDuration(value);
  };

  const style = {
    card: {
      width: '100%',
      maxWidth: '500px',
      borderRadius: 24,
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      padding: '40px 32px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      height: fullHeight ? '100%' : 'auto',
      minHeight: fullHeight ? '100%' : 'auto',
      boxSizing: 'border-box',
    },
    title: {
      textAlign: 'center',
      marginBottom: 32,
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontSize: '28px',
      fontWeight: 700
    },
    formItem: {
      marginBottom: 24
    },
    label: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#1e293b',
      marginBottom: 8
    },
    select: {
      width: '100%',
      height: '48px',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      fontSize: '16px'
    },
    inputNumber: {
      width: '100%',
      height: '48px',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      fontSize: '16px'
    },
    submitButton: {
      width: '100%',
      height: '56px',
      borderRadius: 16,
      fontSize: '18px',
      fontWeight: 600,
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      border: 'none',
      color: 'white',
      marginTop: 16,
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  };

  return (
    <div style={style.card}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
        zIndex: 1
      }} />
      
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <Title level={2} style={style.title}>
          Pomodoro Settings
        </Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            workDuration: 1500,
            cycles: 4
          }}
          style={{ width: '100%' }}
        >
          <Form.Item 
            label={<span style={style.label}>Work Duration</span>} 
            name="workDuration"
            style={style.formItem}
          >
            <Select
              onChange={handleWorkDurationChange}
              placeholder="Select work duration"
              style={style.select}
            >
              <Option value={5}>5 seconds</Option>
              <Option value={300}>5 minutes</Option>
              <Option value={600}>10 minutes</Option>
              <Option value={900}>15 minutes</Option>
              <Option value={1200}>20 minutes</Option>
              <Option value={1500}>25 minutes</Option>
              <Option value={1800}>30 minutes</Option>
              <Option value={3600}>1 hour</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </Form.Item>

          {workDuration === 'custom' && (
            <Form.Item 
              label={<span style={style.label}>Custom Duration (seconds)</span>} 
              name="customWorkDuration"
              style={style.formItem}
            >
              <InputNumber
                min={1}
                max={7200}
                style={style.inputNumber}
                placeholder="Enter seconds"
              />
            </Form.Item>
          )}
          
          <Form.Item 
            label={<span style={style.label}>Number of Cycles</span>} 
            name="cycles"
            style={style.formItem}
          >
            <InputNumber
              min={1}
              max={10}
              style={style.inputNumber}
              placeholder="Enter number of cycles"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={style.submitButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Confirm Settings
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PomodoroSettings;