// returns { ok, issues[], metrics{} }
function checkLeftRotation(lms, shoulderTol = 15, rotationThreshold = 0.3, eyeAngleTol = 20) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const eyeAngle = angleBetween(xy("right_eye"), xy("left_eye"));
    const noseToLeftEye = distance(xy("nose"), xy("left_eye"));
    const noseToRightEye = distance(xy("nose"), xy("right_eye"));
    
    // For left rotation, nose should be closer to left eye than right eye
    const rotationRatio = noseToLeftEye / noseToRightEye;
    console.log(`Rotation ratio (left): ${rotationRatio} (nose to left eye / nose to right eye)`);
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (eyeAngle > eyeAngleTol) issues.push("head_tilted_while_rotating");
    if (rotationRatio > (1 - rotationThreshold)) issues.push("insufficient_left_rotation");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            eye_angle: { value: eyeAngle, rule: `abs <= ${eyeAngleTol}` },
            rotation_ratio: { value: rotationRatio, rule: `<= ${1 - rotationThreshold} (left rotation)` },
            nose_to_left_eye: { value: noseToLeftEye },
            nose_to_right_eye: { value: noseToRightEye }
        }
    };
}

// returns { ok, issues[], metrics{} }
function checkRightRotation(lms, shoulderTol = 15, rotationThreshold = 0.15, eyeAngleTol = 20) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const eyeAngle = angleBetween(xy("right_eye"), xy("left_eye"));
    const noseToLeftEye = distance(xy("nose"), xy("left_eye"));
    const noseToRightEye = distance(xy("nose"), xy("right_eye"));
    
    // For right rotation, nose should be closer to right eye than left eye
    const rotationRatio = noseToRightEye / noseToLeftEye;
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (eyeAngle > eyeAngleTol) issues.push("head_tilted_while_rotating");
    if (rotationRatio > (1 - rotationThreshold)) issues.push("insufficient_right_rotation");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            eye_angle: { value: eyeAngle, rule: `abs <= ${eyeAngleTol}` },
            rotation_ratio: { value: rotationRatio, rule: `<= ${1 - rotationThreshold} (right rotation)` },
            nose_to_left_eye: { value: noseToLeftEye },
            nose_to_right_eye: { value: noseToRightEye }
        }
    };
}

// Exercise workflow definition
const NECK_ROTATION_WORKFLOW = {
    name: "Neck Rotation",
    description: "Turn your head to look over one shoulder without moving your torso.",
    holdDuration: 3000, // 3 seconds per step (as per templates.json)
    steps: [
        {
            name: "Position yourself straight - shoulders and head level",
            checkFunction: checkInitialPosition,
            instruction: "Sit tall with spine neutral, shoulders level"
        },
        {
            name: "Rotate your head to the LEFT",
            checkFunction: checkLeftRotation,
            instruction: "Slowly rotate your head to the left until you feel a stretch"
        },
        {
            name: "Rotate your head to the RIGHT",
            checkFunction: checkRightRotation,
            instruction: "Slowly rotate your head to the right until you feel a stretch"
        }
    ]
};
