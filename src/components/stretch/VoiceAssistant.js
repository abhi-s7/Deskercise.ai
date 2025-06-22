import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button } from 'antd';
import { loadVapi } from './loadVapi'; // make sure this path is correct

const { Title } = Typography;

const VoiceAssistant = () => {
  const vapiInstanceRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    console.log('[VoiceAssistant] Starting to load Vapi SDK...');
    const apiKey = process.env.VAPI_API_KEY;
    const assistant = process.env.VAPI_ASSISTANT_ID;
    const customPrompt = 'I have slouched shoulders and my back is bent.';

    loadVapi({
      apiKey,
      assistant,
      customPrompt,
    })
      .then((vapiInstance) => {
        console.log('[VoiceAssistant] Vapi loaded successfully:', vapiInstance);
        vapiInstanceRef.current = vapiInstance;
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('[VoiceAssistant] Error loading Vapi:', error);
      });

    return () => {
      if (vapiInstanceRef.current) {
        console.log('[VoiceAssistant] Cleaning up Vapi instance...');
        vapiInstanceRef.current = null;
      }
    };
  }, []);

  const startCall = () => {
    if (vapiInstanceRef.current) {
      console.log('[VoiceAssistant] Starting Vapi call...');
      try {
        vapiInstanceRef.current.start('02979ea8-f61f-456a-b865-c240811bfc02');
        setIsCalling(true);
      } catch (error) {
        console.error('[VoiceAssistant] Error starting call:', error);
      }
    } else {
      console.warn('[VoiceAssistant] Vapi instance not ready yet.');
    }
  };

  const stopCall = () => {
    if (vapiInstanceRef.current) {
      console.log('[VoiceAssistant] Stopping Vapi call...');
      try {
        vapiInstanceRef.current.stop();
        setIsCalling(false);
      } catch (error) {
        console.error('[VoiceAssistant] Error stopping call:', error);
      }
    }
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Title level={4} style={{ marginBottom: 16 }}>Voice Assistant</Title>
      <p>Voice Assistant component - build your functionality here!</p>

      {isLoaded ? (
        !isCalling ? (
          <Button type="primary" onClick={startCall}>
            🎙️ Start Call
          </Button>
        ) : (
          <Button danger onClick={stopCall}>
            🛑 Stop Call
          </Button>
        )
      ) : (
        <p>Loading assistant...</p>
      )}
    </div>
  );
};

export default VoiceAssistant;
