import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button } from 'antd';

const { Option } = Select;

const PomodoroSettings = ({ onConfirm }) => {
  const [form] = Form.useForm();
  const [workDuration, setWorkDuration] = useState(1500);

  const onFinish = (values) => {
    onConfirm(values);
  };

  const handleWorkDurationChange = (value) => {
    setWorkDuration(value);
  };

  return (
    <Card
      title="Pomodoro Settings"
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
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          workDuration: 1500,
          cycles: 4
        }}
      >
        <Form.Item label="Work Duration" name="workDuration">
          <Select
            onChange={handleWorkDurationChange}
            placeholder="Select work duration"
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
          <Form.Item label="Custom Duration (seconds)" name="customWorkDuration">
            <InputNumber
              min={1}
              max={7200}
              style={{ width: '100%' }}
              placeholder="Enter seconds"
            />
          </Form.Item>
        )}
        
        <Form.Item label="Number of Cycles" name="cycles">
          <InputNumber
            min={1}
            max={10}
            style={{ width: '100%' }}
            placeholder="Enter number of cycles"
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Confirm Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PomodoroSettings; 