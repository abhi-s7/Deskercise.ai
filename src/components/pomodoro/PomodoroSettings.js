import React, { useState } from 'react';
import { Card, Form, Select, InputNumber, Button, Divider } from 'antd';

const { Option } = Select;

const PomodoroSettings = () => {
  const [form] = Form.useForm();
  const [workTimeType, setWorkTimeType] = useState('preset');

  const onFinish = (values) => {
    console.log('Form values:', values);
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
          workTimeType: 'preset',
          workTimePreset: 25,
          workTimeCustom: 25,
          cycles: 4
        }}
      >
        
        <Form.Item label="Time Type" name="workTimeType">
          <Select onChange={(value) => setWorkTimeType(value)}>
            <Option value="preset">Preset</Option>
            <Option value="custom">Custom</Option>
          </Select>
        </Form.Item>

        {workTimeType === 'preset' ? (
          <Form.Item label="Work Duration" name="workTimePreset">
            <Select>
              <Option value={15}>15 minutes</Option>
              <Option value={20}>20 minutes</Option>
              <Option value={25}>25 minutes</Option>
              <Option value={30}>30 minutes</Option>
              <Option value={45}>45 minutes</Option>
              <Option value={60}>60 minutes</Option>
            </Select>
          </Form.Item>
        ) : (
          <Form.Item label="Custom Work Duration (minutes)" name="workTimeCustom">
            <InputNumber
              min={1}
              max={120}
              style={{ width: '100%' }}
              placeholder="Enter minutes"
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
            Save Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PomodoroSettings; 