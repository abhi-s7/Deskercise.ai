import React, { useState, useRef, useEffect } from "react";
import { Card, Typography, Button, Tooltip, Space } from "antd";
import { PlayCircleOutlined, ReloadOutlined, UndoOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import StretchModal from "./StretchModal";

const { Title, Text } = Typography;

const PomodoroTimer = ({ workDuration, cycles, onSessionStateChange, fullHeight, showTitle }) => {
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [showStretchModal, setShowStretchModal] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { setSession, updateSessionData, clearSession, activeSession, sessionData } = useSession();

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Reset timer when workDuration or cycles change (but preserve session on mount)
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  
  // Handle session restoration when session data becomes available
  useEffect(() => {
    if (activeSession === 'pomodoro' && sessionData && sessionData.cyclesCompleted !== undefined && !hasRestoredSession) {
      setHasSessionStarted(true);
      setCyclesCompleted(sessionData.cyclesCompleted || 0);
      setHasRestoredSession(true);
      console.log('Restored Pomodoro session:', sessionData);
    } else if (activeSession !== 'pomodoro') {
      setHasRestoredSession(false);
    }
  }, [activeSession, sessionData, hasRestoredSession]); // Run when session data changes

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      setTimeLeft(workDuration);
      return;
    }
    
    // Don't clear session if we have an active Pomodoro session (user is just returning to the page)
    if (activeSession === 'pomodoro') {
      console.log('🛡️ Preventing session clear - active Pomodoro session detected');
      setTimeLeft(workDuration);
      return;
    }
    
    // Only clear session when settings actually change and no active session exists
    console.log('⚙️ Settings changed - resetting timer and clearing session');
    setTimeLeft(workDuration);
    setIsRunning(false);
    setCyclesCompleted(0);
    setHasSessionStarted(false);
    clearSession();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [workDuration, cycles, clearSession, isInitialMount, activeSession]);

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

  const style = {
    card: {
      width: '100%',
      height: '100%',
      borderRadius: 24,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px 16px",
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: fullHeight ? '100%' : 'auto',
      boxSizing: 'border-box',
    },
    title: {
      textAlign: 'center',
      marginBottom: 16,
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 3s ease-in-out infinite',
      fontSize: '2rem',
      fontWeight: 800,
      letterSpacing: '0.01em',
      lineHeight: 1.2
    },
    content: {
      textAlign: "center",
      width: "100%",
      position: 'relative',
      zIndex: 2,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    timer: {
      marginBottom: 30,
      padding: '32px 0'
    },
    timerText: {
      fontSize: "2.8rem",
      margin: 0,
      fontWeight: 700,
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textShadow: '0 4px 8px rgba(239, 68, 68, 0.3)'
    },
    cycleInfo: {
      marginBottom: 32,
      padding: '12px 12px',
      background: 'rgba(99, 102, 241, 0.1)',
      borderRadius: 16,
      border: '1px solid rgba(99, 102, 241, 0.2)'
    },
    cycleText: {
      fontSize: "1.2rem",
      fontWeight: 600,
      color: '#6366f1'
    },
    completedText: {
      fontSize: "1rem",
      fontWeight: 600,
      color: '#10b981'
    },
    buttonGroup: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      height: '40px',
      fontSize: '0.95rem',
      fontWeight: 600,
      borderRadius: 16,
      padding: '0 28px',
      border: 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    },
    startButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none'
    },
    pauseButton: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      border: 'none'
    },
    resetButton: {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      color: 'white',
      border: 'none'
    },
    stopButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      border: 'none'
    }
  };

  return (
    <>
      <div style={style.card}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%)',
          zIndex: 1
        }} />
        {showTitle && (
          <Title level={2} style={style.title} className="gradient-text">
            Pomodoro Timer
          </Title>
        )}
        <div style={style.content}>
          <div style={style.timer}>
            <Title level={1} style={style.timerText}>
              {formatTime(timeLeft)}
            </Title>
          </div>

          <div style={style.cycleInfo}>
            {cyclesCompleted >= cycles ? (
              <Text style={style.completedText}>
                All Cycles Completed! 🎉
              </Text>
            ) : (
              <Text style={style.cycleText}>
                Cycle {cyclesCompleted + 1} of {cycles}
              </Text>
            )}
          </div>

          <div style={style.buttonGroup}>
            {!isRunning ? (
              <Button 
                type="primary" 
                size="large" 
                icon={<PlayCircleOutlined />}
                style={{ ...style.button, ...style.startButton }}
                onClick={handleStart}
              >
                {cyclesCompleted >= cycles ? 'Start New Session' : 'Start'}
              </Button>
            ) : (
              <Button 
                size="large" 
                icon={<PauseCircleOutlined />}
                style={{ ...style.button, ...style.pauseButton }}
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
                  style={{ ...style.button, ...style.resetButton }}
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
                  style={{ ...style.button, ...style.stopButton }}
                  disabled={isRunning}
                  onClick={handleStopSession}
                >
                  Stop Session
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

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
