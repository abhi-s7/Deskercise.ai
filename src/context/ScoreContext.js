import React, { createContext, useContext, useState } from 'react';

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  const incrementScore = (points = 1) => {
    setScore(prevScore => prevScore + points);
  };

  const resetScore = () => {
    setScore(0);
  };

  return (
    <ScoreContext.Provider 
      value={{ 
        score, 
        incrementScore, 
        resetScore 
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};

export default ScoreContext; 