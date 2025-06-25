import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, Typography, Space, Alert, Select } from 'antd';
import { CameraOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useExercise } from '../../context/ExerciseContext';

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
  const lastCompletionRef = useRef({ time: 0, exercise: null });
  
  const { addCompletedExercise, resetDailyProgress } = useExercise();
  
  // Handle messages from iframe
  const handleIframeMessage = useCallback((event) => {
    console.log('Received message from iframe:', event.data);
    
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
          console.log('Exercise started, ready for completion');
          break;
        
        case 'exercise-completed':
          const now = Date.now();
          const timeSinceLastCompletion = now - lastCompletionRef.current.time;
          const isSameExercise = lastCompletionRef.current.exercise === selectedExercise;
          
          console.log('Exercise completed! Processing...', { 
            selectedExercise, 
            isExerciseActive, 
            exerciseCompleted, 
            timeSinceLastCompletion,
            isSameExercise,
            lastCompletionData: lastCompletionRef.current
          });
          
          // Only process if:
          // 1. Exercise is currently active
          // 2. Not already marked as completed 
          // 3. Either different exercise OR enough time has passed (3 seconds)
          const shouldProcess = isExerciseActive && 
                               !exerciseCompleted && 
                               (!isSameExercise || timeSinceLastCompletion > 3000);
          
          if (shouldProcess) {
            console.log('Processing exercise completion...');
            
            setIsExerciseActive(false);
            setExerciseCompleted(true);
            setCurrentExercise(null);
            
            // Update completion tracking
            lastCompletionRef.current = {
              time: now,
              exercise: selectedExercise
            };
            
            // Add to completed exercises (no score increment for now)
            if (selectedExercise) {
              const exerciseName = selectedExercise.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              console.log('Adding completed exercise:', exerciseName);
              addCompletedExercise(exerciseName);
            } else {
              console.warn('No selected exercise to add to completed list');
            }
          } else {
            console.log('Ignoring duplicate/rapid completion message', { 
              isExerciseActive, 
              exerciseCompleted, 
              timeSinceLastCompletion,
              isSameExercise,
              reason: !isExerciseActive ? 'not active' : 
                     exerciseCompleted ? 'already completed' : 
                     'too rapid/duplicate'
            });
          }
          break;
        
        case 'exercise-reset':
          setIsExerciseActive(false);
          setExerciseCompleted(false);
          setCurrentExercise(null);
          setSelectedExercise(null);
          break;
      }
    }
  }, [selectedExercise, addCompletedExercise, isExerciseActive, exerciseCompleted, resetDailyProgress]);

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
        width: '100%', // Responsive width
        height: '100%', // Responsive height
        minHeight: '400px', // Minimum height to ensure camera is visible
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
            
            <Button
              type="dashed"
              onClick={() => {
                console.log('Resetting daily progress...');
                resetDailyProgress();
              }}
              size="small"
            >
              Clear Progress
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
            borderRadius: '0 0 8px 8px',
          }}
          onLoad={handleIframeLoad}
          title="Stretch Exercise Monitor"
        />
      </div>
    </Card>
  );
};

export default StretchWebcam;