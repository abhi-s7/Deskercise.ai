import React, { createContext, useContext, useState } from 'react';

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [completedExercises, setCompletedExercises] = useState([]);
  const [dailyGoal] = useState(3); // Fixed daily goal of 3 stretches

  const addCompletedExercise = (exerciseName) => {
    console.log('Adding completed exercise to context:', exerciseName);
    setCompletedExercises(prev => {
      console.log('Previous completed exercises:', prev);
      
      // Allow multiple completions of the same exercise
      const newExercise = { 
        name: exerciseName,
        id: Date.now() // Simple ID for React keys
      };
      
      const updated = [...prev, newExercise];
      console.log('Updated completed exercises:', updated);
      return updated;
    });
  };

  const resetDailyProgress = () => {
    setCompletedExercises([]);
  };

  const getCompletedCount = () => {
    return completedExercises.length;
  };

  const getProgressPercentage = () => {
    return Math.round((completedExercises.length / dailyGoal) * 100);
  };

  return (
    <ExerciseContext.Provider 
      value={{ 
        completedExercises,
        dailyGoal,
        addCompletedExercise,
        resetDailyProgress,
        getCompletedCount,
        getProgressPercentage
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};

export default ExerciseContext; 