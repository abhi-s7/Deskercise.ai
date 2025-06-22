import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  // Initialize from localStorage or defaults
  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem('deskercise_activeSession');
    return saved || 'none';
  });
  
  const [sessionData, setSessionData] = useState(() => {
    const saved = localStorage.getItem('deskercise_sessionData');
    return saved ? JSON.parse(saved) : {
      currentCycle: 0,
      totalCycles: 0,
      workDuration: 0,
      cyclesCompleted: 0
    };
  });

  // Persist activeSession to localStorage
  useEffect(() => {
    console.log('📱 Active session changed to:', activeSession);
    localStorage.setItem('deskercise_activeSession', activeSession);
  }, [activeSession]);

  // Persist sessionData to localStorage
  useEffect(() => {
    localStorage.setItem('deskercise_sessionData', JSON.stringify(sessionData));
  }, [sessionData]);

  const updateSessionData = useCallback((data) => {
    setSessionData(prev => ({ ...prev, ...data }));
  }, []);

  const setSession = useCallback((sessionType) => {
    console.log('🍅 SETTING SESSION to:', sessionType);
    setActiveSession(sessionType);
  }, []);

  const clearSession = useCallback(() => {
    console.log('🗑️ CLEARING SESSION - Called from:', new Error().stack);
    setActiveSession('none');
    setSessionData({
      currentCycle: 0,
      totalCycles: 0,
      workDuration: 0,
      cyclesCompleted: 0
    });
    // Clear from localStorage too
    localStorage.removeItem('deskercise_activeSession');
    localStorage.removeItem('deskercise_sessionData');
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