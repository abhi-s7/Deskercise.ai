// returns { ok, issues[], metrics{} }
function checkLeftTilt(lms, shoulderTol = 15, eyeTiltMin = 15) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const eyeSignedAngle = signedAngleBetween(xy("right_eye"), xy("left_eye"));
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (Math.abs(eyeSignedAngle) < eyeTiltMin) issues.push("insufficient_left_tilt");
    if (eyeSignedAngle > 0) issues.push("wrong_tilt_direction"); // positive angle means right tilt
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            eye_tilt_angle: { value: eyeSignedAngle, rule: `<= -${eyeTiltMin} (left tilt)` }
        }
    };
}

// returns { ok, issues[], metrics{} }
function checkRightTilt(lms, shoulderTol = 15, eyeTiltMin = 15) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const eyeSignedAngle = signedAngleBetween(xy("right_eye"), xy("left_eye"));
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (Math.abs(eyeSignedAngle) < eyeTiltMin) issues.push("insufficient_right_tilt");
    if (eyeSignedAngle < 0) issues.push("wrong_tilt_direction"); // negative angle means left tilt
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            eye_tilt_angle: { value: eyeSignedAngle, rule: `>= ${eyeTiltMin} (right tilt)` }
        }
    };
}

// Exercise workflow definition
const LATERAL_NECK_TILT_WORKFLOW = {
    name: "Lateral Neck Tilt",
    description: "Drop one ear toward the same-side shoulder while sitting tall.",
    holdDuration: 2000, // 2 seconds per step
    steps: [
        {
            name: "Position yourself straight - shoulders and head level",
            checkFunction: checkInitialPosition,
            instruction: "Sit upright with shoulders level and head straight"
        },
        {
            name: "Tilt your head to the LEFT",
            checkFunction: checkLeftTilt,
            instruction: "Slowly tilt your head so your right ear approaches your right shoulder"
        },
        {
            name: "Tilt your head to the RIGHT", 
            checkFunction: checkRightTilt,
            instruction: "Slowly tilt your head so your left ear approaches your left shoulder"
        }
    ]
};
