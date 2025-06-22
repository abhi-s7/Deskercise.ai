import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Alert, Select } from 'antd';
import { CameraOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const StretchWebcam = ({ onExerciseSelect }) => {
  const iframeRef = useRef(null);
  const [isIframeReady, setIsIframeReady] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle messages from iframe
  const handleIframeMessage = useCallback((event) => {
    if (event.data.source === 'stretch-iframe') {
      switch (event.data.type) {
        case 'iframe-ready':
          setIsIframeReady(true);
          setAvailableExercises(event.data.data.exercises || []);
          break;
        
        case 'exercise-selected':
          setSelectedExercise(event.data.data.exercise);
          setError(null);
          break;
        
        case 'exercise-started':
          setCurrentExercise(event.data.data);
          setIsExerciseActive(true);
          setExerciseCompleted(false);
          setError(null);
          break;
        
        case 'exercise-completed':
          setIsExerciseActive(false);
          setExerciseCompleted(true);
          setCurrentExercise(null);
          break;
        
        case 'exercise-reset':
          setIsExerciseActive(false);
          setExerciseCompleted(false);
          setCurrentExercise(null);
          setSelectedExercise(null);
          break;
      }
    }
  }, []);

  // Send message to iframe
  const sendMessageToIframe = useCallback((type, data) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: type,
        data: data,
        source: 'react-app'
      }, '*');
    }
  }, []);

  // Handle exercise selection
  const handleExerciseSelect = useCallback((exercise) => {
    setSelectedExercise(exercise);
    sendMessageToIframe('select-exercise', { exercise });
    
    // Notify parent component
    if (onExerciseSelect) {
      onExerciseSelect(exercise);
    }
  }, [sendMessageToIframe, onExerciseSelect]);

  // Handle start exercise
  const handleStartExercise = useCallback(() => {
    if (selectedExercise) {
      sendMessageToIframe('start-exercise', {});
    }
  }, [selectedExercise, sendMessageToIframe]);

  // Handle reset exercise
  const handleResetExercise = useCallback(() => {
    sendMessageToIframe('reset-exercise', {});
  }, [sendMessageToIframe]);

  // Set up message listener
  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [handleIframeMessage]);

  // Handle iframe load
  const handleIframeLoad = () => {
    // Iframe loaded, but we'll wait for the 'iframe-ready' message
    console.log('Stretch iframe loaded');
  };

  return (
    <Card
      title={
        <Space>
          <CameraOutlined />
          <span>Stretch Monitor</span>
        </Space>
      }
      style={{
        width: '800px', // Fixed width for camera view
        minHeight: '780px', // Minimum height to ensure camera is visible
        height: '780px', // Fixed height
        flexShrink: 0, // Don't shrink
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{
        flex: 1,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Exercise Controls */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Exercise Selection */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Select
              placeholder="Select an exercise..."
              style={{ flex: 1 }}
              value={selectedExercise}
              onChange={handleExerciseSelect}
              disabled={!isIframeReady || isExerciseActive}
            >
              {availableExercises.map(exercise => (
                <Option key={exercise} value={exercise}>
                  {exercise.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Option>
              ))}
            </Select>
            
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartExercise}
              disabled={!selectedExercise || isExerciseActive}
            >
              Start
            </Button>
            
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetExercise}
              disabled={!isExerciseActive && !exerciseCompleted}
            >
              Reset
            </Button>
          </div>

          {/* Minimal Status Messages - only essential ones */}
          {!isIframeReady && (
        <Alert
              message="Loading stretch monitor..."
              type="info"
          showIcon
            />
          )}
          
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
            />
          )}
        </Space>
      </div>

      {/* Iframe Container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {!isIframeReady && (
      <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa',
            zIndex: 1
          }}>
            <Text type="secondary">Loading stretch monitor...</Text>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src="/stretch-js/stretch-iframe.html"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '0 0 8px 8px'
          }}
          onLoad={handleIframeLoad}
          title="Stretch Exercise Monitor"
        />
      </div>
    </Card>
  );
};

export default StretchWebcam;