import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { CameraOutlined, VideoCameraOutlined, StopOutlined } from '@ant-design/icons';
import { processStep2_CheckStretch } from '../../logic/stretchLogic';

const { Title, Text } = Typography;

const StretchWebcam = () => {
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
  const [isPostureGood, setIsPostureGood] = useState(false);
  const [postureCheckActive, setPostureCheckActive] = useState(false);

  // --- MediaPipe Posture Logic (from PosturePage) ---
  const KEYMAPPER = {
    0:"nose",1:"left_eye_inner",2:"left_eye",3:"left_eye_outer",4:"right_eye_inner",
    5:"right_eye",6:"right_eye_outer",7:"left_ear",8:"right_ear",9:"mouth_left",
    10:"mouth_right",11:"left_shoulder",12:"right_shoulder",13:"left_elbow",
    14:"right_elbow",15:"left_wrist",16:"right_wrist",17:"left_pinky",18:"right_pinky",
    19:"left_index",20:"right_index",21:"left_thumb",22:"right_thumb",23:"left_hip",
    24:"right_hip",25:"left_knee",26:"right_knee",27:"left_ankle",28:"right_ankle",
    29:"left_heel",30:"right_heel",31:"left_foot_index",32:"right_foot_index"
  };
  
  const NAME2IDX = Object.fromEntries(
    Object.entries(KEYMAPPER).map(([i,n]) => [n, parseInt(i,10)])
  );
  
  const deg = rad => rad * 180 / Math.PI;
  
  function angleBetween(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.abs(deg(Math.atan2(dy, dx)));
  }
  
  function checkInitialPosition(lms, shoulderTol = 10, headTol = 10) {
    const xy = name => lms[NAME2IDX[name]];
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const headAngle = angleBetween(xy("right_eye"), xy("left_eye"));
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (headAngle > headTol) issues.push("head_not_level");
    return { ok: issues.length === 0, issues };
  }

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
      // Clear and draw video frame
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      
      if (results.poseLandmarks) {
        // Draw pose landmarks
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { lineWidth: 1 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { lineWidth: 1, radius: 1, color: '#FF0000' });
        
        // Always check posture and update state
        const postureCheck = checkInitialPosition(results.poseLandmarks);
        setIsPostureGood(postureCheck.ok);
        
        // Show continuous feedback if we're in step 1
        if (currentStep === 1) {
          if (!postureCheckActive) {
            // Show real-time feedback when not actively validating
            if (postureCheck.ok) {
              setAiMessage("✅ Posture is straight! Ready when you are - click 'Check Posture' to proceed.");
            } else {
              setAiMessage(`❌ Posture needs adjustment: ${postureCheck.issues.join(', ')}`);
            }
          }
          // When actively checking, the validation logic in processStep1_CheckPosture handles the messages
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

  // Real posture checking logic for Step 1
  const processStep1_CheckPosture = async () => {
    return new Promise((resolve) => {
      setPostureCheckActive(true);
      setAiMessage("Analyzing your posture... Please hold still and stand straight.");
      
      let goodPostureCount = 0;
      const requiredGoodFrames = 30; // Need ~1 second of good posture at 30fps
      
      const checkInterval = setInterval(() => {
        if (isPostureGood) {
          goodPostureCount++;
          setAiMessage(`✅ Good posture! Hold it... (${Math.floor(goodPostureCount/6)}/5 seconds)`);
          
          if (goodPostureCount >= requiredGoodFrames) {
            clearInterval(checkInterval);
            setPostureCheckActive(false);
            resolve(true);
          }
        } else {
          goodPostureCount = 0; // Reset counter if posture becomes bad
        }
      }, 100); // Check every 100ms
      
      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        setPostureCheckActive(false);
        if (goodPostureCount < requiredGoodFrames) {
          resolve(false);
        }
      }, 30000);
    });
  };

  // --- Step Execution Logic ---
  const handleNextStep = async () => {
    setIsProcessing(true);

    if (currentStep === 1) {
      const step1Success = await processStep1_CheckPosture();
      if (step1Success) {
        setStep1Complete(true);
        setCurrentStep(2);
        setAiMessage("Excellent! Your posture is perfect. Now, press 'Start Stretch' to begin the exercise.");
      } else {
        setAiMessage("Let's try again. Please adjust your posture - keep your shoulders level and head straight.");
      }
    }

    if (currentStep === 2) {
      setAiMessage("Analyzing your stretch... Keep holding that form!");
      const step2Success = await processStep2_CheckStretch();
      if (step2Success) {
        setStep2Complete(true);
        setCurrentStep(3);
        setAiMessage("🎉 Excellent work! Stretch complete. You've done a fantastic job!");
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
      background: postureCheckActive ? 
        'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' :
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 12,
      padding: 20,
      margin: '20px 0',
      position: 'relative',
      boxShadow: postureCheckActive ? 
        '0 0 20px rgba(82, 196, 26, 0.4)' :
        '0 0 20px rgba(102, 126, 234, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      animation: postureCheckActive ? 'pulse 1s ease-in-out infinite' : 'glow 2s ease-in-out infinite alternate'
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
        background: postureCheckActive ? 
          'linear-gradient(135deg, #52c41a 0%, #389e0d 100%)' :
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {postureCheckActive ? 'ANALYZING POSTURE' : 'AI COACH'}
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