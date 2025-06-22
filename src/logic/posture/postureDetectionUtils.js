// postureDetectionUtils.js

// MediaPipe landmark mapping
export const KEYMAPPER = {
  0:"nose",1:"left_eye_inner",2:"left_eye",3:"left_eye_outer",4:"right_eye_inner",
  5:"right_eye",6:"right_eye_outer",7:"left_ear",8:"right_ear",9:"mouth_left",
  10:"mouth_right",11:"left_shoulder",12:"right_shoulder",13:"left_elbow",
  14:"right_elbow",15:"left_wrist",16:"right_wrist",17:"left_pinky",18:"right_pinky",
  19:"left_index",20:"right_index",21:"left_thumb",22:"right_thumb",23:"left_hip",
  24:"right_hip",25:"left_knee",26:"right_knee",27:"left_ankle",28:"right_ankle",
  29:"left_heel",30:"right_heel",31:"left_foot_index",32:"right_foot_index"
};

export const NAME2IDX = Object.fromEntries(
  Object.entries(KEYMAPPER).map(([i,n]) => [n, parseInt(i,10)])
);

// Helper functions
export const deg = rad => rad * 180 / Math.PI;

export function angleBetween(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.abs(deg(Math.atan2(dy, dx)));
}

// Core posture detection functions
export function checkInitialPosture(landmarks, shoulderTol = 10, headTol = 10) {
  const xy = name => landmarks[NAME2IDX[name]];
  const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
  const headAngle = angleBetween(xy("right_eye"), xy("left_eye"));
  const issues = [];
  
  if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
  if (headAngle > headTol) issues.push("head_not_level");
  
  return { ok: issues.length === 0, issues };
}

export function checkArmRaise(landmarks) {
  const xy = name => landmarks[NAME2IDX[name]];
  const leftShoulder = xy("left_shoulder");
  const rightShoulder = xy("right_shoulder");
  const leftWrist = xy("left_wrist");
  const rightWrist = xy("right_wrist");
  
  const leftArmRaised = leftWrist.y < leftShoulder.y;
  const rightArmRaised = rightWrist.y < rightShoulder.y;
  
  return leftArmRaised && rightArmRaised;
}

export function checkSquatPosition(landmarks) {
  const xy = name => landmarks[NAME2IDX[name]];
  const leftHip = xy("left_hip");
  const rightHip = xy("right_hip");
  const leftKnee = xy("left_knee");
  const rightKnee = xy("right_knee");
  
  const leftKneeBent = leftKnee.y > leftHip.y;
  const rightKneeBent = rightKnee.y > rightHip.y;
  
  return leftKneeBent && rightKneeBent;
}

// Generic movement checker
export function checkMovement(landmarks, movementType) {
  switch(movementType) {
    case "initial_posture":
      return checkInitialPosture(landmarks);
    case "arm_raise":
      return checkArmRaise(landmarks);
    case "squat":
      return checkSquatPosition(landmarks);
    case "neck_roll":
      return { ok: checkNeckRoll(landmarks) };
    default:
      return { ok: false, issues: [`Unknown movement type: ${movementType}`] };
  }
}

export function checkNeckRoll(landmarks) {
  const xy = name => landmarks[NAME2IDX[name]];
  const nose = xy("nose");
  const leftEar = xy("left_ear");
  const rightEar = xy("right_ear");
  
  // Calculate head tilt angle
  const earAngle = angleBetween(leftEar, rightEar);
  
  // Neck roll detected if head is tilted (ears not level)
  return earAngle > 15; // Head tilted more than 15 degrees
}