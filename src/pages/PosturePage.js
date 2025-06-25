import React, { useEffect, useRef } from 'react';
import { Card, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

const PosturePage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    // --- Posture Checking Logic (from original index.html and check1.js) ---

    // Define globals to make linter happy, as these are from external scripts
    const { Pose, POSE_CONNECTIONS, Camera } = window;
    const { drawConnectors, drawLandmarks } = window;

    // --- Start of check1.js logic ---
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
    // --- End of check1.js logic ---

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    const messageEl = messageRef.current;
    
    // Initialize MediaPipe Pose
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { lineWidth: 1 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { lineWidth: 1, radius: 1, color: '#FF0000' });
        
        const postureCheck = checkInitialPosition(results.poseLandmarks);
        if (postureCheck.ok) {
          messageEl.textContent = "✅ Posture is straight!";
          messageEl.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)';
          messageEl.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        } else {
          messageEl.textContent = `❌ Not straight: ${postureCheck.issues.join(', ')}`;
          messageEl.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)';
          messageEl.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
        }
      }
      canvasCtx.restore();
    }

    pose.onResults(onResults);

    // Start camera
    try {
      const camera = new Camera(videoElement, {
        onFrame: async () => await pose.send({ image: videoElement }),
        width: 640,
        height: 480
      });
      camera.start().catch(error => handleCameraError(error));
    } catch (error) {
      handleCameraError(error);
    }

    function handleCameraError(error) {
      console.error('Camera start failed:', error);
      if (messageEl) {
        messageEl.textContent = `Error accessing camera: ${error.message}. Check permissions.`;
        messageEl.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)';
        messageEl.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
      }
    }

    // Cleanup on component unmount
    return () => {
      pose.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  const style = {
    container: {
      padding: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: 'calc(100vh - 64px)',
      position: 'relative'
    },
    pageTitle: {
      textAlign: 'center',
      marginBottom: '32px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 3s ease-in-out infinite',
      fontSize: '36px',
      fontWeight: 800
    },
    headerSection: {
      width: 640,
      marginBottom: 32,
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 24,
      padding: '32px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden'
    },
    cameraCard: {
      width: 640,
      height: 480,
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 24,
      padding: '24px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    messageBox: {
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      zIndex: 2,
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
      transition: 'all 0.3s ease'
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 16
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 16
    }
  };

  return (
    <div style={style.container}>
      {/* Page Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}>
        <Title level={1} style={style.pageTitle} className="gradient-text">
          AI Posture Detection
        </Title>
      </div>

      {/* Header Section */}
      <div style={style.headerSection}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Title level={2} style={{ marginBottom: 16, color: '#1e293b' }}>
            Posture Check Test Page
          </Title>
          <Text style={{ color: '#64748b', fontSize: '16px' }}>
            An isolated environment to test the MediaPipe posture detection with AI-powered analysis.
          </Text>
          <Divider style={{ margin: '24px 0' }} />
        </div>
      </div>

      {/* Camera Section */}
      <div style={style.cameraCard}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div ref={messageRef} style={style.messageBox}>
            Initializing AI...
          </div>
          <video ref={videoRef} autoPlay muted playsInline style={style.video}></video>
          <canvas ref={canvasRef} style={style.canvas}></canvas>
        </div>
      </div>
    </div>
  );
};

export default PosturePage;