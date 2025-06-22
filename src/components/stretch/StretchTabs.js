import React, { useState } from 'react';
import { Card, Tabs, Space } from 'antd';
import { 
  HeartOutlined, 
  ClockCircleOutlined, 
  TrophyOutlined, 
  BookOutlined,
  PlayCircleOutlined,
  AudioOutlined
} from '@ant-design/icons';
import QuickStretchesTab from './QuickStretchesTab';
import ProgressTab from './ProgressTab';
import AchievementsTab from './AchievementsTab';
import TipsTab from './TipsTab';
import VoiceAssistant from './VoiceAssistant';

const { TabPane } = Tabs;

const StretchTabs = () => {
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
        width: '50%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '900px',
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
        size="middle"
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
          <QuickStretchesTab />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Progress
            </span>
          } 
          key="2"
        >
          <ProgressTab />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Achievements
            </span>
          } 
          key="3"
        >
          <AchievementsTab />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <BookOutlined />
              Tips & Guide
            </span>
          } 
          key="4"
        >
          <TipsTab />
        </TabPane>

        <TabPane 
          tab={
            <span>
              <AudioOutlined />
              Voice Assistant
            </span>
          } 
          key="5"
        >
          <VoiceAssistant />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default StretchTabs; 