import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { CameraOutlined, VideoCameraOutlined, StopOutlined } from '@ant-design/icons';
import { processStep1_CheckPosture, processStep2_CheckStretch } from '../../logic/stretchLogic';

const { Title, Text } = Typography;

const StretchWebcam = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  
  // Progress and State Management
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [aiMessage, setAiMessage] = useState("Let's get started! Please align your body with the camera view.");

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError(null);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  // --- Step Execution Logic ---
  const handleNextStep = async () => {
    setIsProcessing(true);

    if (currentStep === 1) {
      setAiMessage("Analyzing your posture... Please hold still.");
      const step1Success = await processStep1_CheckPosture();
      if (step1Success) {
        setStep1Complete(true);
        setCurrentStep(2);
        setAiMessage("Great! Your posture is perfect. Now, press 'Start Stretch' to begin the exercise.");
      } else {
        setAiMessage("Hmm, something's not quite right. Please try adjusting your posture and try again.");
      }
    }

    if (currentStep === 2) {
      setAiMessage("Analyzing your stretch... Keep holding that form!");
      const step2Success = await processStep2_CheckStretch();
      if (step2Success) {
        setStep2Complete(true);
        setCurrentStep(3); // End of flow
        setAiMessage("Excellent work! Stretch complete. You've done a fantastic job.");
      } else {
        setAiMessage("Almost there! Let's refine that form a bit. Please try the stretch again.");
      }
    }
    
    setIsProcessing(false);
  };

  // --- Lifecycle Hooks ---
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Progress Dots Component
  const ProgressDots = () => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      margin: '20px 0',
      gap: '0'
    }}>
      {/* Step 1 Circle */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: step1Complete ? '#52c41a' : '#d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        boxShadow: step1Complete ? '0 0 10px rgba(82, 196, 26, 0.5)' : 'none',
        zIndex: 2,
        position: 'relative'
      }}>
        {step1Complete ? '✓' : '1'}
      </div>
      
      {/* Connecting Line */}
      <div style={{
        width: 60,
        height: 2,
        backgroundColor: step1Complete ? '#52c41a' : '#d9d9d9',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 1
      }} />
      
      {/* Step 2 Circle */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: step2Complete ? '#52c41a' : '#d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        boxShadow: step2Complete ? '0 0 10px rgba(82, 196, 26, 0.5)' : 'none',
        zIndex: 2,
        position: 'relative'
      }}>
        {step2Complete ? '✓' : '2'}
      </div>
    </div>
  );

  // AI Message Box Component
  const AIMessageBox = () => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 12,
      padding: 20,
      margin: '20px 0',
      position: 'relative',
      boxShadow: '0 0 20px rgba(102, 126, 234, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: 'glow 2s ease-in-out infinite alternate'
    }}>
      <style>
        {`
          @keyframes glow {
            from {
              box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
            }
            to {
              box-shadow: 0 0 30px rgba(102, 126, 234, 0.6), 0 0 40px rgba(118, 75, 162, 0.3);
            }
          }
        `}
      </style>
      
      {/* AI Indicator */}
      <div style={{
        position: 'absolute',
        top: -8,
        left: 20,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        AI COACH
      </div>
      
      <div style={{
        color: 'white',
        fontSize: '14px',
        lineHeight: '1.5',
        marginTop: 8
      }}>
        {aiMessage}
      </div>
    </div>
  );

  return (
    <Card
      title={
        <Space>
          <VideoCameraOutlined />
          <span>Stretch Monitor</span>
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
        padding: 24,
        flex: '1 1 auto',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {error && (
        <Alert
          message="Camera Error"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        flex: '1 1 auto',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        minHeight: 250,
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 8
          }}
        />
        {!isStreaming && !error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <CameraOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <div style={{ marginTop: 8, color: '#999' }}>Starting camera...</div>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <ProgressDots />

      {/* AI Message Box */}
      <AIMessageBox />

      {/* Control Buttons */}
      <Space style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
        {isStreaming && currentStep < 3 && (
          <Button 
            type="primary"
            onClick={handleNextStep}
            size="large"
            loading={isProcessing}
            disabled={isProcessing}
          >
            {currentStep === 1 && 'Check Posture'}
            {currentStep === 2 && 'Start Stretch'}
          </Button>
        )}

        {isStreaming && (
          <Button 
            danger 
            icon={<StopOutlined />}
            onClick={stopCamera}
            size="large"
          >
            Stop Camera
          </Button>
        )}
      </Space>
    </Card>
  );
};

export default StretchWebcam;