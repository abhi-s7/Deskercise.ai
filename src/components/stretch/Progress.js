import React from 'react';
import { Card, Space, Row, Col, Divider } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import CompletedExercises from './CompletedExercises';
import StretchProgress from './StretchProgress';

const Progress = () => {
  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>Progress</span>
        </Space>
      }
      style={{
        width: '100%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '450px',
      }}
      bodyStyle={{
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: '24px',
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <StretchProgress />
        </Col>
        <Col span={12}>
          <CompletedExercises />
        </Col>
      </Row>
    </Card>
  );
};

export default Progress; 