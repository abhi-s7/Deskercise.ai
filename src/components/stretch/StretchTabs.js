import React, { useState } from 'react';
import { Card, Tabs, Space } from 'antd';
import { 
  HeartOutlined, 
  BookOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';
import QuickStretchesTab from './QuickStretchesTab';
import TipsTab from './TipsTab';

const { TabPane } = Tabs;

const StretchTabs = ({ selectedExercise }) => {
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Card
      title={
        <Space>
          <HeartOutlined />
          <span>Stretch Guide</span>
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
        padding: '1px 24px 24px',
      }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        type="card"
        size="small"
      >
        <TabPane 
          tab={
            <span>
              <PlayCircleOutlined />
              Quick Stretches
            </span>
          } 
          key="1"
        >
          <QuickStretchesTab selectedExercise={selectedExercise} />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <BookOutlined />
              Tips & Guide
            </span>
          } 
          key="2"
        >
          <TipsTab />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default StretchTabs; 