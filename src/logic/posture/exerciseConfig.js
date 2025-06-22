export const EXERCISE_CONFIGS = {
  neck_roll: {
    name: "Neck Roll Exercise",
    steps: [
      {
        stepNumber: 1,
        name: "Check Posture",
        movementType: "initial_posture",
        requiredFrames: 30,
        instruction: "Stand straight with shoulders level",
        successMessage: "Perfect posture! Ready for neck roll.",
        failMessage: "Adjust your posture - keep shoulders level and head straight"
      },
      {
        stepNumber: 2,
        name: "Start Neck Roll",
        movementType: "neck_roll",
        requiredFrames: 45,
        instruction: "Slowly roll your head in a circular motion",
        successMessage: "Excellent neck roll completed!",
        failMessage: "Continue the neck rolling motion"
      }
    ]
  },
  arm_stretch: {
    name: "Arm Stretch Exercise", 
    steps: [
      {
        stepNumber: 1,
        name: "Check Posture",
        movementType: "initial_posture",
        requiredFrames: 30,
        instruction: "Stand straight with shoulders level",
        successMessage: "Perfect posture! Ready for arm stretch.",
        failMessage: "Adjust your posture - keep shoulders level and head straight"
      },
      {
        stepNumber: 2, 
        name: "Start Stretch",
        movementType: "arm_raise",
        requiredFrames: 45,
        instruction: "Raise both arms above your shoulders",
        successMessage: "Excellent arm stretch completed!",
        failMessage: "Keep both arms raised above shoulders"
      }
    ]
  }
};

export function getExerciseConfig(exerciseType) {
  return EXERCISE_CONFIGS[exerciseType] || null;
}

export function getStepConfig(exerciseType, stepNumber) {
  const exercise = getExerciseConfig(exerciseType);
  if (!exercise) return null;
  
  return exercise.steps.find(step => step.stepNumber === stepNumber) || null;
}