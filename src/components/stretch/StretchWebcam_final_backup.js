import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { CameraOutlined, VideoCameraOutlined, StopOutlined } from '@ant-design/icons';
import { checkMovement } from '../../logic/posture/postureDetectionUtils';
import { getExerciseConfig, getStepConfig } from '../../logic/posture/exerciseConfig';

const { Title, Text } = Typography;
let stopProcessing = false;

const StretchWebcam = ({ exerciseType = "neck_roll" }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  
  // Progress and State Management
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);
  const [aiMessage, setAiMessage] = useState("Initializing camera and pose detection...");

  // MediaPipe pose detection state
  const [pose, setPose] = useState(null);

  // Get exercise configuration
  const exerciseConfig = getExerciseConfig(exerciseType);
  const totalSteps = exerciseConfig ? exerciseConfig.steps.length : 2;

  // Generic movement detection states
  const [currentMovementStatus, setCurrentMovementStatus] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

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
        
        // Initialize MediaPipe Pose after camera starts
        initializeMediaPipe();
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
    
    // Clean up MediaPipe
    if (pose) {
      pose.close();
      setPose(null);
    }
  };

  const initializeMediaPipe = () => {
    // Check if MediaPipe is available
    if (!window.Pose) {
      setError('MediaPipe libraries not loaded. Please ensure the scripts are included.');
      return;
    }

    const { Pose, POSE_CONNECTIONS } = window;
    const { drawConnectors, drawLandmarks } = window;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');
    
    // Initialize MediaPipe Pose
    const poseInstance = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`
    });
    
    poseInstance.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

   

    function onResults(results) {

      if (stopProcessing) return; 
      // Clear and draw video frame
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      
      if (results.poseLandmarks) {
        // Draw pose landmarks
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { lineWidth: 1 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { lineWidth: 1, radius: 1, color: '#FF0000' });
        
        // Get current step configuration
        const stepConfig = getStepConfig(exerciseType, currentStep);
        
        if (stepConfig) {
          // Check movement based on current step configuration
          const movementResult = checkMovement(results.poseLandmarks, stepConfig.movementType);
          const isMovementGood = movementResult.ok !== undefined ? movementResult.ok : movementResult;
          
          // Update the generic movement state
          setCurrentMovementStatus(isMovementGood);
          
          // Show real-time feedback ONLY when not validating
          if (!isValidating) { // <---- this stops the loop
            if (isMovementGood) {
              console.log('Inside !isValidating, isMovementGood', stepConfig.instruction);
              setAiMessage(`✅ ${stepConfig.instruction} - Looking good! Click button to validate.`);
            } else {
              const issues = movementResult.issues || [];
              console.log('Inside !isValidating, else', stepConfig.instruction);
              setAiMessage(`❌ ${stepConfig.instruction}${issues.length > 0 ? ` (${issues.join(', ')})` : ''}`);
            }
          }
        }
      }
      canvasCtx.restore();
    }

    poseInstance.onResults(onResults);
    setPose(poseInstance);

    // Update initial message once MediaPipe is ready
    setTimeout(() => {
      if (currentStep === 1) {
        setAiMessage("Stand straight and align your body with the camera. I'll continuously monitor your posture.");
      }
    }, 2000);

    // Start camera processing
    if (window.Camera) {
      const camera = new window.Camera(videoElement, {
        onFrame: async () => {
          if (poseInstance) {
            await poseInstance.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });
      camera.start().catch(error => {
        console.error('Camera processing failed:', error);
      });
    }
  };

  // Generic step validation logic
  const processStepValidation = async () => {
    stopProcessing = true; 
    const stepConfig = getStepConfig(exerciseType, currentStep);
    if (!stepConfig) return false;
    
    return new Promise((resolve) => {
      setIsValidating(true);
      setTimeout(() => {
        setAiMessage(`Analyzing... ${stepConfig.instruction}`);
      }, 0);
      
      let goodFrameCount = 0;
      let hasResolved = false;
      
      const checkInterval = setInterval(() => {
        if (hasResolved) {
          clearInterval(checkInterval);
          return;
        }
        
        if (currentMovementStatus) {
          goodFrameCount++;
          const secondsCount = Math.floor(goodFrameCount/6);
          const totalSeconds = Math.floor(stepConfig.requiredFrames/6);
          console.log('Inside processStepValidation, currentMovementStatus', currentMovementStatus);
          setAiMessage(`✅ Good form! Hold it... (${secondsCount}/${totalSeconds} seconds)`);
          
          if (goodFrameCount >= stepConfig.requiredFrames && !hasResolved) {
            hasResolved = true;
            clearInterval(checkInterval);
            setIsValidating(false);
            setAiMessage(stepConfig.successMessage);
            stopProcessing = false;
            setTimeout(() => resolve(true), 1000);
          }
        } else {
          goodFrameCount = 0;
          console.log('Inside processStepValidation, else');
          setAiMessage(`❌ ${stepConfig.failMessage}`);
        }
      }, 100);
      
      // Timeout
      setTimeout(() => {
        if (!hasResolved) {
          hasResolved = true;
          clearInterval(checkInterval);
          setIsValidating(false);
          setAiMessage("⏰ Time's up! Let's try again.");
          stopProcessing = false;
          resolve(false);
        }
      }, 45000);
    });
  };

  // --- Step Execution Logic ---
  const handleNextStep = async () => {
    setIsProcessing(true);
    
    const stepSuccess = await processStepValidation();
    
    if (stepSuccess) {
      // Mark current step as complete
      if (currentStep === 1) setStep1Complete(true);
      if (currentStep === 2) setStep2Complete(true);
      
      if (currentStep < totalSteps) {
        // Move to next step
        setCurrentStep(currentStep + 1);
        const nextStepConfig = getStepConfig(exerciseType, currentStep + 1);
        console.log('Inside handleNextStep, currentStep', currentMovementStatus);
        setAiMessage(`Great! Now: ${nextStepConfig?.instruction || 'Next step'}`);
      } else {
        // All steps complete
        setCurrentStep(totalSteps + 1);
        setAiMessage("🎉 Exercise completed! Great job!");
      }
    } else {
      // Step failed, try again
      const currentStepConfig = getStepConfig(exerciseType, currentStep);
      setAiMessage(`Let's try again. ${currentStepConfig?.instruction}`);
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
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: step1Complete ? '#52c41a' : (currentStep === 1 ? '#1890ff' : '#d9d9d9'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        boxShadow: step1Complete ? '0 0 10px rgba(82, 196, 26, 0.5)' : 
                   (currentStep === 1 ? '0 0 10px rgba(24, 144, 255, 0.5)' : 'none'),
        zIndex: 2,
        position: 'relative'
      }}>
        {step1Complete ? '✓' : '1'}
      </div>
      
      <div style={{
        width: 60,
        height: 2,
        backgroundColor: step1Complete ? '#52c41a' : '#d9d9d9',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 1
      }} />
      
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        backgroundColor: step2Complete ? '#52c41a' : (currentStep === 2 ? '#1890ff' : '#d9d9d9'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.3s ease',
        boxShadow: step2Complete ? '0 0 10px rgba(82, 196, 26, 0.5)' : 
                   (currentStep === 2 ? '0 0 10px rgba(24, 144, 255, 0.5)' : 'none'),
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
      background: isValidating ? 
        'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' :
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 12,
      padding: 20,
      margin: '20px 0',
      position: 'relative',
      boxShadow: isValidating ? 
        '0 0 20px rgba(82, 196, 26, 0.4)' :
        '0 0 20px rgba(102, 126, 234, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: isValidating ? 'pulse 1s ease-in-out infinite' : 'glow 2s ease-in-out infinite alternate'
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
          
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 20px rgba(82, 196, 26, 0.4);
            }
            50% {
              box-shadow: 0 0 40px rgba(82, 196, 26, 0.8);
            }
          }
        `}
      </style>
      
      <div style={{
        position: 'absolute',
        top: -8,
        left: 20,
        background: isValidating ? 
          'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' :
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {isValidating ? 'ANALYZING' : 'AI COACH'}
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
            borderRadius: 8,
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 8,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />
        {!isStreaming && !error && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 2
          }}>
            <CameraOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <div style={{ marginTop: 8, color: '#999' }}>Starting camera...</div>
          </div>
        )}
      </div>

      <ProgressDots />
      <AIMessageBox />

      <Space style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
        {isStreaming && currentStep <= totalSteps && (
          <Button 
            type="primary"
            onClick={handleNextStep}
            size="large"
            loading={isProcessing}
            disabled={isProcessing}
          >
            {getStepConfig(exerciseType, currentStep)?.name || `Step ${currentStep}`}
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