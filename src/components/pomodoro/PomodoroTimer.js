import React, { useState, useRef, useEffect } from "react";
import { Card, Typography, Button, Tooltip, Space } from "antd";
import { PlayCircleOutlined, ReloadOutlined, UndoOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import StretchModal from "./StretchModal";

const { Title, Text } = Typography;

const PomodoroTimer = ({ workDuration, cycles, onSessionStateChange }) => {
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [showStretchModal, setShowStretchModal] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { setSession, updateSessionData, clearSession } = useSession();

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Reset timer when workDuration or cycles change
  useEffect(() => {
    setTimeLeft(workDuration);
    setIsRunning(false);
    setCyclesCompleted(0);
    setHasSessionStarted(false);
    clearSession();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [workDuration, cycles, clearSession]);

  useEffect(() => {
    if (onSessionStateChange) {
      onSessionStateChange(isRunning, hasSessionStarted);
    }
  }, [isRunning, hasSessionStarted, onSessionStateChange]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            
            // Send notification when cycle completes
            if ('Notification' in window && Notification.permission === 'granted') {
              showCustomNotification();
            }
            
            if (cyclesCompleted < cycles) {
              setCyclesCompleted(cyclesCompleted + 1);
              setTimeLeft(workDuration);
              // Update session data after cycle completion
              const newCyclesCompleted = cyclesCompleted + 1;
              updateSessionData({
                currentCycle: newCyclesCompleted < cycles ? newCyclesCompleted + 1 : cycles,
                totalCycles: cycles,
                workDuration: workDuration,
                cyclesCompleted: newCyclesCompleted
              });
              
              // Show stretch modal for users on the page
              setShowStretchModal(true);
            }
            return workDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear interval when timer is paused
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, cyclesCompleted, cycles, workDuration, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = async () => {
    if (cyclesCompleted >= cycles) {
      // Act as hard reset when all cycles are completed
      setTimeLeft(workDuration);
      setIsRunning(false);
      setCyclesCompleted(0);
      setHasSessionStarted(false);
      clearSession();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      // Debug notification support
      checkNotificationSupport();
      
      // Request notification permission before starting
      const permission = await requestNotificationPermission();
      console.log('Final notification permission:', permission);
      
      setIsRunning(true);
      setHasSessionStarted(true);
      setSession('pomodoro');
      updateSessionData({
        currentCycle: cyclesCompleted + 1,
        totalCycles: cycles,
        workDuration: workDuration,
        cyclesCompleted: cyclesCompleted
      });
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(workDuration);
    setCyclesCompleted(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleStopSession = () => {
    setIsRunning(false);
    setTimeLeft(workDuration);
    setCyclesCompleted(0);
    setHasSessionStarted(false);
    clearSession();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleGoToStretch = () => {
    setShowStretchModal(false);
    navigate('/stretch');
  };

  const handleSkipStretch = () => {
    setShowStretchModal(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      console.log('Notification permission requested:', permission);
      return permission;
    }
    console.log('Current notification permission:', Notification.permission);
    return Notification.permission;
  };

  const checkNotificationSupport = () => {
    console.log('Notification API supported:', 'Notification' in window);
    console.log('Current permission:', Notification.permission);
    console.log('Browser:', navigator.userAgent);
  };

  const showCustomNotification = () => {
    // Create a browser-wide system notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification('Pomodoro Cycle Complete! 🎉', {
          body: `Cycle ${cyclesCompleted + 1} of ${cycles} completed. Time for a stretch!`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'pomodoro-cycle-complete',
          requireInteraction: true,
          silent: false, // Ensure sound plays
          actions: [
            {
              action: 'stretch',
              title: 'Go to Stretch'
            }
          ]
        });
        
        // Handle notification click
        notification.onclick = () => {
          window.focus();
          navigate('/stretch');
          notification.close();
        };

        // Handle action button click (Firefox support)
        notification.onactionclick = (event) => {
          if (event.action === 'stretch') {
            window.focus();
            navigate('/stretch');
          }
          notification.close();
        };

        // Fallback for browsers that don't support action buttons
        notification.onclick = () => {
          window.focus();
          navigate('/stretch');
          notification.close();
        };

        // Auto-close after 30 seconds if user doesn't interact
        setTimeout(() => {
          notification.close();
        }, 30000);

        console.log('Notification sent successfully');
      } catch (error) {
        console.error('Error creating notification:', error);
        // Fallback: try without action buttons for Firefox
        try {
          const fallbackNotification = new Notification('Pomodoro Cycle Complete! 🎉', {
            body: `Cycle ${cyclesCompleted + 1} of ${cycles} completed. Click to go to stretch!`,
            icon: '/favicon.ico',
            requireInteraction: true,
            silent: false
          });
          
          fallbackNotification.onclick = () => {
            window.focus();
            navigate('/stretch');
            fallbackNotification.close();
          };

          setTimeout(() => {
            fallbackNotification.close();
          }, 30000);
          
          console.log('Fallback notification sent successfully');
        } catch (fallbackError) {
          console.error('Fallback notification also failed:', fallbackError);
        }
      }
    } else {
      console.log('Notification permission not granted or not supported');
    }
  };

  return (
    <>
      <Card
        style={{
          width: "60%",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={1} style={{ fontSize: "4rem", margin: 0 }}>
              {formatTime(timeLeft)}
            </Title>
          </div>

          <div style={{ marginBottom: 32 }}>
            {cyclesCompleted >= cycles ? (
              <Text strong style={{ fontSize: "1.2rem", color: '#52c41a' }}>
                All Cycles Completed! 🎉
              </Text>
            ) : (
              <Text strong style={{ fontSize: "1.2rem" }}>
                Cycle {cyclesCompleted + 1} of {cycles}
              </Text>
            )}
          </div>

          <Space size="large">
            {!isRunning ? (
              <Button 
                type="primary" 
                size="large" 
                icon={<PlayCircleOutlined />}
                style={{ height: '48px', fontSize: '1.1rem' }}
                onClick={handleStart}
              >
                {cyclesCompleted >= cycles ? 'Start New Session' : 'Start'}
              </Button>
            ) : (
              <Button 
                size="large" 
                icon={<PauseCircleOutlined />}
                style={{ height: '48px', fontSize: '1.1rem' }}
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
            
            {hasSessionStarted && (
              <Tooltip title="Reset for this cycle">
                <Button 
                  size="large" 
                  icon={<ReloadOutlined />}
                  style={{ height: '48px', fontSize: '1.1rem' }}
                  disabled={isRunning}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Tooltip>
            )}

            {hasSessionStarted && cyclesCompleted < cycles && (
              <Tooltip title="Stop session and reset timer and cycles">
                <Button 
                  size="large" 
                  icon={<UndoOutlined />}
                  style={{ height: '48px', fontSize: '1.1rem' }}
                  disabled={isRunning}
                  onClick={handleStopSession}
                >
                  Stop Session
                </Button>
              </Tooltip>
            )}
          </Space>
        </div>
      </Card>

      <StretchModal
        visible={showStretchModal}
        onGoToStretch={handleGoToStretch}
        onSkip={handleSkipStretch}
        currentCycle={cyclesCompleted}
        totalCycles={cycles}
      />
    </>
  );
};

export default PomodoroTimer;
