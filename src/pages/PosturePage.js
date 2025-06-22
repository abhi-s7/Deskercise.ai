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
          messageEl.style.background = 'rgba(0,255,0,0.7)';
        } else {
          messageEl.textContent = `❌ Not straight: ${postureCheck.issues.join(', ')}`;
          messageEl.style.background = 'rgba(255,0,0,0.7)';
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
        messageEl.style.background = 'rgba(255,0,0,0.7)';
      }
    }

    // Cleanup on component unmount
    return () => {
      pose.close();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ width: 640, marginBottom: 20, textAlign: 'center' }}>
        <Title level={2}>Posture Check Test Page</Title>
        <Text type="secondary">An isolated environment to test the MediaPipe posture detection.</Text>
        <Divider />
      </div>
      <Card style={{ width: 640, height: 480, position: 'relative' }}>
        <div ref={messageRef} style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 4,
          fontSize: 14,
          zIndex: 2,
        }}>
          Initializing...
        </div>
        <video ref={videoRef} autoPlay muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></video>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
      </Card>
    </div>
  );
};

export default PosturePage; 