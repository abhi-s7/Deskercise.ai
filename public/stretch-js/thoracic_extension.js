// returns { ok, issues[], metrics{} }
function checkThoracicExtension(lms, shoulderTol = 15, chestLiftMin = 0.03, elbowSpreadMin = 30) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    
    // Use nose-to-shoulder distance as proxy for chest lift (upper body only)  
    // When chest lifts, the distance from nose to shoulders increases
    const nose = xy("nose");
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
    };
    
    const noseToShoulderDistance = distance(nose, shoulderMidpoint);
    
    // Alternative: Use shoulder-to-ear angle for chest lift detection
    const leftEar = xy("left_ear");
    const rightEar = xy("right_ear");
    const earMidpoint = {
        x: (leftEar.x + rightEar.x) / 2,
        y: (leftEar.y + rightEar.y) / 2
    };
    
    // When chest lifts, shoulders move down relative to head
    const shoulderToEarDistance = distance(shoulderMidpoint, earMidpoint);
    
    // Use elbows instead of hands since hands disappear behind head
    const leftElbow = xy("left_elbow");
    const rightElbow = xy("right_elbow");
    
    // Calculate elbow spread angle (more reliable than hand tracking)
    const leftVector = { x: leftElbow.x - leftShoulder.x, y: leftElbow.y - leftShoulder.y };
    const rightVector = { x: rightElbow.x - rightShoulder.x, y: rightElbow.y - rightShoulder.y };
    
    const dotProduct = leftVector.x * rightVector.x + leftVector.y * rightVector.y;
    const leftMag = Math.sqrt(leftVector.x * leftVector.x + leftVector.y * leftVector.y);
    const rightMag = Math.sqrt(rightVector.x * rightVector.x + rightVector.y * rightVector.y);
    
    const cosAngle = dotProduct / (leftMag * rightMag);
    const elbowSpreadAngle = deg(Math.acos(Math.max(-1, Math.min(1, cosAngle))));
    
    // Check if elbows are positioned for hands-behind-head pose
    // Elbows should be: 1) Higher than shoulders, 2) Laterally positioned
    const leftElbowAboveShoulder = leftElbow.y < leftShoulder.y; // y decreases upward
    const rightElbowAboveShoulder = rightElbow.y < rightShoulder.y;
    
    // Check if elbows are laterally positioned (indicating hands behind head)
    // When hands are behind head, elbows move outward from the ears
    const leftElbowOutward = Math.abs(leftElbow.x - leftEar.x) > Math.abs(leftShoulder.x - leftEar.x);
    const rightElbowOutward = Math.abs(rightElbow.x - rightEar.x) > Math.abs(rightShoulder.x - rightEar.x);
    
    // Check if elbows are at appropriate height (at or above ear level)
    const leftElbowAtGoodHeight = leftElbow.y <= leftEar.y;
    const rightElbowAtGoodHeight = rightElbow.y <= rightEar.y;
    
    // Check for chest lift using shoulder-ear distance (increases when chest lifts)
    const chestLifted = shoulderToEarDistance > chestLiftMin;
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (!chestLifted) issues.push("insufficient_chest_lift");
    if (elbowSpreadAngle < elbowSpreadMin) issues.push("elbows_not_wide_enough");
    if (!leftElbowAboveShoulder || !leftElbowAtGoodHeight || !leftElbowOutward) {
        issues.push("left_arm_not_in_position");
    }
    if (!rightElbowAboveShoulder || !rightElbowAtGoodHeight || !rightElbowOutward) {
        issues.push("right_arm_not_in_position");
    }
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            nose_to_shoulder_distance: { value: noseToShoulderDistance, rule: "upper body measurement" },
            shoulder_to_ear_distance: { value: shoulderToEarDistance, rule: `> ${chestLiftMin} (chest lifted)` },
            elbow_spread_angle: { value: elbowSpreadAngle, rule: `>= ${elbowSpreadMin}° (elbows wide)` },
            left_elbow_above_shoulder: { value: leftElbowAboveShoulder, rule: "true" },
            right_elbow_above_shoulder: { value: rightElbowAboveShoulder, rule: "true" },
            left_elbow_outward: { value: leftElbowOutward, rule: "true (elbow wider than shoulder)" },
            right_elbow_outward: { value: rightElbowOutward, rule: "true (elbow wider than shoulder)" },
            left_elbow_height_ok: { value: leftElbowAtGoodHeight, rule: "true (at or above ear level)" },
            right_elbow_height_ok: { value: rightElbowAtGoodHeight, rule: "true (at or above ear level)" }
        }
    };
}

// Helper function to calculate angle between three points (reused from overhead_reach)
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
const THORACIC_EXTENSION_WORKFLOW = {
    name: "Thoracic Extension",
    description: "Hands behind head, lift chest upward to extend mid-back.",
    holdDuration: 3000, // 3 seconds per step (as per templates.json)
    steps: [
        {
            name: "Position yourself straight - shoulders and head level",
            checkFunction: checkInitialPosition,
            instruction: "Sit upright with shoulders level and head straight"
        },
        {
            name: "Place hands behind head and lift chest upward",
            checkFunction: checkThoracicExtension,
            instruction: "Place fingertips behind ears, elbows wide, inhale and lift sternum toward ceiling"
        }
    ]
};
