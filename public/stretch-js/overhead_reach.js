// returns { ok, issues[], metrics{} }
function checkOverheadReach(lms, shoulderTol = 15, elbowHeightTol = 0.05, elbowAngleMin = 160) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const leftEyeY = xy("left_eye").y;
    const rightEyeY = xy("right_eye").y;
    const eyeLevel = (leftEyeY + rightEyeY) / 2;
    
    const leftElbowY = xy("left_elbow").y;
    const rightElbowY = xy("right_elbow").y;
    
    // Check if both elbows are above eye level
    const leftElbowAboveEyes = leftElbowY < eyeLevel; // y decreases upward
    const rightElbowAboveEyes = rightElbowY < eyeLevel;
    
    // Calculate elbow-shoulder-hip angles for arm straightness
    const leftElbowShoulderHip = calculateAngle(xy("left_elbow"), xy("left_shoulder"), xy("left_hip"));
    const rightElbowShoulderHip = calculateAngle(xy("right_elbow"), xy("right_shoulder"), xy("right_hip"));
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (!leftElbowAboveEyes) issues.push("left_elbow_not_above_eyes");
    if (!rightElbowAboveEyes) issues.push("right_elbow_not_above_eyes");
    if (leftElbowShoulderHip < elbowAngleMin) issues.push("left_arm_not_straight_enough");
    if (rightElbowShoulderHip < elbowAngleMin) issues.push("right_arm_not_straight_enough");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            left_elbow_above_eyes: { value: leftElbowAboveEyes, rule: "true (elbow above eye level)" },
            right_elbow_above_eyes: { value: rightElbowAboveEyes, rule: "true (elbow above eye level)" },
            left_arm_angle: { value: leftElbowShoulderHip, rule: `>= ${elbowAngleMin}°` },
            right_arm_angle: { value: rightElbowShoulderHip, rule: `>= ${elbowAngleMin}°` },
            eye_level: { value: eyeLevel },
            left_elbow_y: { value: leftElbowY },
            right_elbow_y: { value: rightElbowY }
        }
    };
}

// Helper function to calculate angle between three points
function calculateAngle(p1, p2, p3) {
    // Calculate angle at p2 formed by p1-p2-p3
    const dx1 = p1.x - p2.x;
    const dy1 = p1.y - p2.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;
    
    const dot = dx1 * dx2 + dy1 * dy2;
    const mag1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const mag2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    
    const cos_angle = dot / (mag1 * mag2);
    const angle_rad = Math.acos(Math.max(-1, Math.min(1, cos_angle)));
    return deg(angle_rad);
}

// Exercise workflow definition
const OVERHEAD_REACH_WORKFLOW = {
    name: "Overhead Reach",
    description: "Lift both arms overhead, biceps next to ears, ribs down.",
    holdDuration: 3000, // 3 seconds per step (as per templates.json)
    steps: [
        {
            name: "Position yourself straight - shoulders and head level",
            checkFunction: checkInitialPosition,
            instruction: "Sit upright with shoulders level and head straight"
        },
        {
            name: "Raise both arms overhead - biceps next to ears",
            checkFunction: checkOverheadReach,
            instruction: "Raise both arms straight up, keep elbows straight and alongside ears"
        }
    ]
};
