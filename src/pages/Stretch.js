import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import StretchWebcam from "../components/stretch/StretchWebcam";
import StretchTabs from "../components/stretch/StretchTabs";
import Progress from "../components/stretch/Progress";
import CongratulationsModal from "../components/stretch/CongratulationsModal";
import { useExercise } from "../context/ExerciseContext";
import { useScore } from "../context/ScoreContext";
import { useSession } from "../context/SessionContext";

const { Title } = Typography;

const Stretch = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [hasAwardedPoints, setHasAwardedPoints] = useState(false);
  
  const navigate = useNavigate();
  const { getCompletedCount, dailyGoal, resetDailyProgress } = useExercise();
  const { incrementScore } = useScore();
  const { activeSession } = useSession();
  
  // Check if user has completed 3/3 stretches
  useEffect(() => {
    const completedCount = getCompletedCount();
    
    if (completedCount >= dailyGoal && !showCongratulations && !hasAwardedPoints) {
      console.log('User completed daily goal! Showing congratulations...');
      setShowCongratulations(true);
      setHasAwardedPoints(true);
      incrementScore(300); // Award 300 points
    }
  }, [getCompletedCount, dailyGoal, showCongratulations, hasAwardedPoints, incrementScore]);
  
  const handleModalClose = () => {
    setShowCongratulations(false);
    // Reset for next session
    setHasAwardedPoints(false);
  };

  const handleGoHome = () => {
    setShowCongratulations(false);
    setHasAwardedPoints(false);
    navigate('/');
  };
  
  const handleGoToPomodoro = () => {
    setShowCongratulations(false);
    setHasAwardedPoints(false);
    navigate('/pomodoro');
  };
  
  const hasActivePomodoroSession = activeSession === 'pomodoro';

  const style = {
    outerContainer: {
      padding: "28px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "calc(100vh - 64px - 64px)",
      gap: "0px", // Removed gap since no title
      overflow: "hidden",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      position: 'relative',
      marginBottom: 0
    },
    contentContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      gap: "40px",
      width: "100vw",
      height: "calc(100vh - 64px - 64px)", // Full height since no title
      justifyContent: "center",
      padding: "0 28px",
      boxSizing: "border-box"
    },
    leftSection: {
      flex: "3 1 0", // 50% width - Stretch Monitor
      minWidth: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    },
    rightSection: {
      flex: "3 1 0", // 50% width - Guide + Progress
      minWidth: "0",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      height: "100%"
    },
    stretchGuideSection: {
      flex: "1 1 0", // Equal share of right section
      minHeight: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    },
    progressSection: {
      flex: "1 1 0", // Equal share of right section  
      minHeight: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    },
    cardBase: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      padding: '12px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      animation: 'floating 6s ease-in-out infinite',
      transition: 'all 0.3s ease'
    },
    pageTitle: {
      textAlign: 'center',
      marginBottom: '0px',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 3s ease-in-out infinite',
      fontSize: '36px',
      fontWeight: 800
    },
    webcamOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
      zIndex: 1,
      pointerEvents: 'none'
    },
    stretchGuideOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
      zIndex: 1,
      pointerEvents: 'none'
    },
    progressOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
      zIndex: 1,
      pointerEvents: 'none'
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 2,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={style.outerContainer}>
      {/* Main Content Container */}
      <div style={style.contentContainer}>
        
        {/* Left Section - Stretch Monitor (40%) */}
        <div style={style.leftSection}>
          <div style={{
            ...style.cardBase,
            animationDelay: '0s'
          }}>
            <div style={style.webcamOverlay} />
            <div style={style.contentWrapper}>
              <StretchWebcam onExerciseSelect={setSelectedExercise} />
            </div>
          </div>
        </div>

        {/* Right Section (60%) */}
        <div style={style.rightSection}>
          
          {/* Stretch Guide Section (50% of right section height) */}
          <div style={style.stretchGuideSection}>
            <div style={{
              ...style.cardBase,
              animationDelay: '1s'
            }}>
              <div style={style.stretchGuideOverlay} />
              <div style={style.contentWrapper}>
                <StretchTabs selectedExercise={selectedExercise} />
              </div>
            </div>
          </div>

          {/* Progress Section (50% of right section height) */}
          <div style={style.progressSection}>
            <div style={{
              ...style.cardBase,
              animationDelay: '2s'
            }}>
              <div style={style.progressOverlay} />
              <div style={style.contentWrapper}>
                <Progress />
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <CongratulationsModal
        visible={showCongratulations}
        onClose={handleModalClose}
        onGoHome={handleGoHome}
        onGoToPomodoro={handleGoToPomodoro}
        hasActivePomodoroSession={hasActivePomodoroSession}
        onResetProgress={resetDailyProgress}
      />
    </div>
  );
};

export default Stretch;