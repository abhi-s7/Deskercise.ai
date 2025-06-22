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

  return (
    <div style={{
      padding: "32px",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      minHeight: "calc(100vh - 64px - 64px)",
      gap: "24px"
    }}>
      <StretchWebcam onExerciseSelect={setSelectedExercise} />
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        flex: 1
      }}>
        <StretchTabs selectedExercise={selectedExercise} />
        <Progress />
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
