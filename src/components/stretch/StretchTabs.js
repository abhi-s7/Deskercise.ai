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
      title={null}
      style={{
        width: '100%',
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '200px',
      }}
      bodyStyle={{
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: '12px',
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '8px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <HeartOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Stretch Guide</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('1')}
            style={{
              padding: '4px 12px',
              border: activeTab === '1' ? '1px solid #1890ff' : '1px solid #d9d9d9',
              borderRadius: '6px',
              background: activeTab === '1' ? '#e6f7ff' : 'white',
              color: activeTab === '1' ? '#1890ff' : '#595959',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <PlayCircleOutlined /> Quick Stretches
          </button>
          <button 
            onClick={() => setActiveTab('2')}
            style={{
              padding: '4px 12px',
              border: activeTab === '2' ? '1px solid #1890ff' : '1px solid #d9d9d9',
              borderRadius: '6px',
              background: activeTab === '2' ? '#e6f7ff' : 'white',
              color: activeTab === '2' ? '#1890ff' : '#595959',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <BookOutlined /> Tips & Guide
          </button>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === '1' && <QuickStretchesTab selectedExercise={selectedExercise} />}
        {activeTab === '2' && <TipsTab />}
      </div>
    </Card>
  );
};

export default StretchTabs;