import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import PomodoroTimer from "../components/pomodoro/PomodoroTimer";
import PomodoroSettings from "../components/pomodoro/PomodoroSettings";
import Progress from "../components/pomodoro/Progress";
import { useSession } from "../context/SessionContext";

const { Title } = Typography;

const Pomodoro = () => {
  const navigate = useNavigate();
  const { activeSession, sessionData } = useSession();
  
  const [timerSettings, setTimerSettings] = useState({
    workDuration: 1500, // 25 minutes in seconds
    cycles: 4
  });
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [hasSessionStarted, setHasSessionStarted] = useState(false);

  // Restore timer settings from session data when there's an active session
  useEffect(() => {
    if (activeSession === 'pomodoro' && sessionData && sessionData.workDuration && sessionData.totalCycles) {
      setTimerSettings({
        workDuration: sessionData.workDuration,
        cycles: sessionData.totalCycles
      });
      setHasSessionStarted(true);
    }
  }, [activeSession, sessionData]);

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSettingsConfirm = (values) => {
    const workDuration = values.workDuration === 'custom' 
      ? values.customWorkDuration 
      : values.workDuration;
    
    setTimerSettings({
      workDuration: parseInt(workDuration),
      cycles: values.cycles
    });
  };

  const handleSessionStateChange = (isRunning, hasStarted) => {
    setIsSessionRunning(isRunning);
    setHasSessionStarted(hasStarted);
  };

  return (
    <div className="pomodoro-outer-container">
      {/* Page Title */}

      {/* Content Layout */}
      <div className="pomodoro-content-container">
        {/* Timer Section */}
        <div className="pomodoro-timer-section">
          <PomodoroTimer fullHeight={true}
            workDuration={timerSettings.workDuration}
            cycles={timerSettings.cycles}
            onSessionStateChange={handleSessionStateChange}
            showTitle={true}
          />
        </div>

        {/* Settings/Progress Section */}
        <div className="pomodoro-content-section">
          {hasSessionStarted ? (
            <Progress fullHeight={true} />
          ) : (
            <PomodoroSettings fullHeight={true} onConfirm={handleSettingsConfirm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
