import React, { useEffect, useRef, useState } from 'react';
import { Typography, Button } from 'antd';
import { loadVapi } from './loadVapi';

const { Title } = Typography;

const VoiceAssistant = ({ exercise }) => {
  const vapiInstanceRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    console.log('[VoiceAssistant] Starting to load Vapi SDK...');
    const apiKey = process.env.REACT_APP_VAPI_API_KEY;
    const assistant = process.env.REACT_APP_VAPI_ASSISTANT_ID;

    const customPrompt = exercise
      ? `The user selected the exercise "${exercise.name}". Help them do this stretch by giving friendly, step-by-step guidance. These are the instructions: ${exercise.instructions.join(' ')}. Also, explain how this stretch benefits posture and wellbeing.`
      : 'I have slouched shoulders and my back is bent.';

    loadVapi({
      apiKey,
      assistant,
      customPrompt,
      exercise,
    })
      .then(({ instance, promptMessage }) => {
        console.log('[VoiceAssistant] Vapi loaded successfully:', instance);
        console.log('[VoiceAssistant] Exercise:', exercise);
        console.log('[VoiceAssistant] Custom Prompt:', customPrompt);
        vapiInstanceRef.current = instance;
        setPrompt(promptMessage);
        setIsLoaded(true);
          // Dynamically add context using background message
      if (exercise) {
        instance.send({
          type: "add-message",
          message: {
            role: "user",
            content: `The user has selected the exercise "${exercise.name}". These are the instructions: ${exercise.instructions.join(' ')}. Please guide them step by step.`,
          },
        });
      }
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
  }, [exercise]);

  const startCall = () => {
    if (vapiInstanceRef.current) {
      try {
        const assistant = process.env.REACT_APP_VAPI_ASSISTANT_ID;
        vapiInstanceRef.current.start(assistant);
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
      {isLoaded ? (
        !isCalling ? (
          <Button 
            type="primary" 
            onClick={startCall}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '25px',
              height: '50px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              justifyContent: 'center'
            }}
            icon={<span style={{ fontSize: '20px' }}>🤖</span>}
          >
            AI Coach
          </Button>
        ) : (
          <Button 
            danger 
            onClick={stopCall}
            style={{
              borderRadius: '25px',
              height: '50px',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              justifyContent: 'center'
            }}
            icon={<span style={{ fontSize: '20px' }}>🛑</span>}
          >
            Stop AI Coach
          </Button>
        )
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          Loading AI Coach...
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;