import React, { createContext, useContext, useState, useCallback } from 'react';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState('none'); // 'none', 'pomodoro', 'calendar'
  const [sessionData, setSessionData] = useState({
    currentCycle: 0,
    totalCycles: 0,
    workDuration: 0,
    cyclesCompleted: 0
  });

  const updateSessionData = useCallback((data) => {
    setSessionData(prev => ({ ...prev, ...data }));
  }, []);

  const setSession = useCallback((sessionType) => {
    setActiveSession(sessionType);
  }, []);

  const clearSession = useCallback(() => {
    setActiveSession('none');
    setSessionData({
      currentCycle: 0,
      totalCycles: 0,
      workDuration: 0,
      cyclesCompleted: 0
    });
  }, []);

  const value = {
    activeSession,
    sessionData,
    setSession,
    clearSession,
    updateSessionData
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}; 