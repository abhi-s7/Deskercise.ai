import React, { useRef, useEffect, useState } from 'react';
import { Card, Button, Typography, Space, Alert } from 'antd';
import { CameraOutlined, VideoCameraOutlined, StopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StretchWebcam = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    // Start camera automatically when component mounts
    startCamera();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, []);

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
      {/* <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Monitor Your Stretches
        </Title>
        <Text type="secondary">
          Use your webcam to track your stretching form and posture
        </Text>
      </div> */}

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

      <Space style={{ width: '100%', justifyContent: 'center' }}>
        {!isStreaming ? (
          <Button 
            type="primary" 
            icon={<VideoCameraOutlined />}
            onClick={startCamera}
            size="large"
          >
            Start Camera
          </Button>
        ) : (
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

      <div style={{ marginTop: 'auto', padding: 12, backgroundColor: '#f6f6f6', borderRadius: 8 }}>
        <Text strong>Tips for better tracking:</Text>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
          <li>Ensure good lighting</li>
          <li>Position yourself in the center of the frame</li>
          <li>Keep your full body visible</li>
          <li>Maintain proper posture during stretches</li>
        </ul>
      </div>
    </Card>
  );
};

export default StretchWebcam; 