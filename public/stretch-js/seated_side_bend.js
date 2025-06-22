// THIS IS NOT WORKING CODE

// Seated Side Bend Exercise Implementation
// Simple, robust implementation using upper-body landmarks only

// Baseline measurements for comparison
let baselineShoulderAngle = null;

// Helper function to calculate shoulder line angle relative to horizontal (X-axis)
function calculateShoulderLineAngle(leftShoulder, rightShoulder) {
    const deltaY = rightShoulder.y - leftShoulder.y;
    const deltaX = rightShoulder.x - leftShoulder.x;
    return Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
}

// Helper function to calculate angle between two vectors
function calculateVectorAngle(vector1, vector2) {
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
    
    const cosAngle = dotProduct / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI;
}

// Check 1: Initial neutral position - establish baseline
function checkSideBendInitial(lms, shoulderTol = 15, headTol = 15) {
    const xy = name => lms[NAME2IDX[name]];
    
    // Get landmarks
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const leftEye = xy("left_eye");
    const rightEye = xy("right_eye");
    
    // Check initial alignment
    const shoulderAngle = angleBetween(rightShoulder, leftShoulder);
    const headAngle = angleBetween(rightEye, leftEye);
    
    // Calculate baseline shoulder line angle with X-axis
    baselineShoulderAngle = calculateShoulderLineAngle(leftShoulder, rightShoulder);
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (headAngle > headTol) issues.push("head_not_level");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            head_angle: { value: headAngle, rule: `abs <= ${headTol}` },
            baseline_shoulder_line_angle: { value: baselineShoulderAngle, rule: "baseline established" }
        }
    };
}

// Check 2: Right arm overhead position
function checkSideBendArmUp(lms, shoulderAngleMax = 15, armShoulderAngleMax = 30) {
    const xy = name => lms[NAME2IDX[name]];
    
    // Get landmarks
    const rightElbow = xy("right_elbow");
    const rightShoulder = xy("right_shoulder");
    const leftShoulder = xy("left_shoulder");
    
    // Check shoulder angle with X-axis (horizontal line)
    const shoulderAngle = calculateShoulderLineAngle(leftShoulder, rightShoulder);
    const shouldersLevel = shoulderAngle <= shoulderAngleMax;
    
    // Calculate shoulder vector (left to right)
    const shoulderVector = {
        x: rightShoulder.x - leftShoulder.x,
        y: rightShoulder.y - leftShoulder.y
    };
    
    // Calculate right arm vector (shoulder to elbow)
    const rightArmVector = {
        x: rightElbow.x - rightShoulder.x,
        y: rightElbow.y - rightShoulder.y
    };
    
    // Calculate angle between shoulder vector and right arm vector
    const armShoulderAngle = calculateVectorAngle(rightArmVector -shoulderVector);
    // should be between 70 and 110 degrees for a good overhead position
    const rightArmOverhead = armShoulderAngle <= 90+ armShoulderAngleMax && armShoulderAngle >= 90 - armShoulderAngleMax;

    console.log(` ${rightArmOverhead} Right arm overhead angle: ${armShoulderAngle}° (shoulder vector vs arm vector)`);
    console.log(` ${shouldersLevel} Shoulders level angle: ${shoulderAngle}° (with X-axis)`);

    
    const issues = [];
    if (!shouldersLevel) issues.push("shoulders_not_level");
    if (!rightArmOverhead) issues.push("right_arm_not_overhead");
    // check if right arm is above shoulder level
    if (rightElbow.y > rightShoulder.y - 0.05) issues.push("right_arm_not_above_shoulder");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `<= ${shoulderAngleMax}° (with X-axis)` },
            arm_shoulder_angle: { value: armShoulderAngle, rule: `<= ${armShoulderAngleMax}° (arm vs shoulder vector)` },
            shoulders_level: { value: shouldersLevel, rule: "true" },
            right_arm_overhead: { value: rightArmOverhead, rule: "true" }
        }
    };
}

// Check 3: Side bend left (stretching right side)
function checkSideBendLeft(lms, sideBendAngleMin = 10, shoulderHeightDiffMin = 0.03) {
    const xy = name => lms[NAME2IDX[name]];
    
    if (!baselineShoulderAngle) {
        return {
            ok: false,
            issues: ["baseline_not_established"],
            metrics: {}
        };
    }
    
    // Get landmarks
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const rightElbow = xy("right_elbow");
    
    // Check if right arm is still overhead using simple Y-position check
    const rightArmStillUp = rightElbow.y < rightShoulder.y - 0.05;
    
    // Calculate current shoulder line angle with X-axis
    const currentShoulderAngle = calculateShoulderLineAngle(leftShoulder, rightShoulder);
    const sideBendAngle = Math.abs(currentShoulderAngle - baselineShoulderAngle);
    
    // When leaning LEFT, the LEFT shoulder goes DOWN (higher Y value)
    const bendingLeft = leftShoulder.y > rightShoulder.y;
    const shoulderHeightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Check requirements
    const sufficientSideBend = sideBendAngle >= sideBendAngleMin;
    const sufficientHeightDiff = shoulderHeightDiff >= shoulderHeightDiffMin;
    const properDirection = bendingLeft;
    
    const issues = [];
    if (!rightArmStillUp) issues.push("right_arm_not_overhead");
    if (!sufficientSideBend && !sufficientHeightDiff) issues.push("insufficient_side_bend");
    if (!properDirection) issues.push("not_bending_left");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            side_bend_angle: { value: sideBendAngle, rule: `>= ${sideBendAngleMin}° from baseline` },
            shoulder_height_diff: { value: shoulderHeightDiff, rule: `>= ${shoulderHeightDiffMin} (shoulder tilt)` },
            bending_left: { value: bendingLeft, rule: "true (left shoulder lower)" },
            right_arm_overhead: { value: rightArmStillUp, rule: "true (maintained position)" },
            current_shoulder_angle: { value: currentShoulderAngle, rule: "current measurement" },
            baseline_shoulder_angle: { value: baselineShoulderAngle, rule: "reference angle" }
        }
    };
}

// Check 4: Return to center
function checkSideBendCenter(lms, centerTol = 10) {
    const xy = name => lms[NAME2IDX[name]];
    
    if (!baselineShoulderAngle) {
        return {
            ok: false,
            issues: ["baseline_not_established"],
            metrics: {}
        };
    }
    
    // Get landmarks
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const leftElbow = xy("left_elbow");
    const rightElbow = xy("right_elbow");
    
    // Check if back to neutral shoulder position
    const currentShoulderAngle = calculateShoulderLineAngle(leftShoulder, rightShoulder);
    const angleDifference = Math.abs(currentShoulderAngle - baselineShoulderAngle);
    const backToCenter = angleDifference <= centerTol;
    
    // Check if arms are back to neutral (both elbows near shoulder level)
    const leftArmNeutral = Math.abs(leftElbow.y - leftShoulder.y) < 0.05;
    const rightArmNeutral = Math.abs(rightElbow.y - rightShoulder.y) < 0.05;
    const armsNeutral = leftArmNeutral && rightArmNeutral;
    
    const issues = [];
    if (!backToCenter) issues.push("not_back_to_center");
    if (!armsNeutral) issues.push("arms_not_neutral");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            back_to_center: { value: backToCenter, rule: `angle difference <= ${centerTol}°` },
            angle_difference: { value: angleDifference, rule: `<= ${centerTol}° from baseline` },
            arms_neutral: { value: armsNeutral, rule: "true (both elbows near shoulder level)" }
        }
    };
}

// Check 5: Left arm overhead position
function checkSideBendLeftArmUp(lms, shoulderAngleMax = 15, armShoulderAngleMax = 70) {
    const xy = name => lms[NAME2IDX[name]];
    
    // Get landmarks
    const leftElbow = xy("left_elbow");
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    
    // Check shoulder angle with X-axis (horizontal line)
    const shoulderAngle = calculateShoulderLineAngle(leftShoulder, rightShoulder);
    const shouldersLevel = shoulderAngle <= shoulderAngleMax;
    
    // Calculate shoulder vector (left to right)
    const shoulderVector = {
        x: rightShoulder.x - leftShoulder.x,
        y: rightShoulder.y - leftShoulder.y
    };
    
    // Calculate left arm vector (shoulder to elbow)
    const leftArmVector = {
        x: leftElbow.x - leftShoulder.x,
        y: leftElbow.y - leftShoulder.y
    };
    
    // Calculate angle between shoulder vector and left arm vector
    const armShoulderAngle = calculateVectorAngle(shoulderVector, leftArmVector);
    const leftArmOverhead = armShoulderAngle <= armShoulderAngleMax;
    
    const issues = [];
    if (!shouldersLevel) issues.push("shoulders_not_level");
    if (!leftArmOverhead) issues.push("left_arm_not_overhead");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `<= ${shoulderAngleMax}° (with X-axis)` },
            arm_shoulder_angle: { value: armShoulderAngle, rule: `<= ${armShoulderAngleMax}° (arm vs shoulder vector)` },
            shoulders_level: { value: shouldersLevel, rule: "true" },
            left_arm_overhead: { value: leftArmOverhead, rule: "true" }
        }
    };
}

// Check 6: Side bend right (stretching left side)
function checkSideBendRight(lms, sideBendAngleMin = 10, shoulderHeightDiffMin = 0.03) {
    const xy = name => lms[NAME2IDX[name]];
    
    if (!baselineShoulderAngle) {
        return {
            ok: false,
            issues: ["baseline_not_established"],
            metrics: {}
        };
    }
    
    // Get landmarks
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const leftElbow = xy("left_elbow");
    
    // Check if left arm is still overhead using simple Y-position check
    const leftArmStillUp = leftElbow.y < leftShoulder.y - 0.05;
    
    // Calculate current shoulder line angle with X-axis
    const currentShoulderAngle = calculateShoulderLineAngle(leftShoulder, rightShoulder);
    const sideBendAngle = Math.abs(currentShoulderAngle - baselineShoulderAngle);
    
    // When leaning RIGHT, the RIGHT shoulder goes DOWN (higher Y value)
    const bendingRight = rightShoulder.y > leftShoulder.y;
    const shoulderHeightDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    
    // Check requirements
    const sufficientSideBend = sideBendAngle >= sideBendAngleMin;
    const sufficientHeightDiff = shoulderHeightDiff >= shoulderHeightDiffMin;
    const properDirection = bendingRight;
    
    const issues = [];
    if (!leftArmStillUp) issues.push("left_arm_not_overhead");
    if (!sufficientSideBend && !sufficientHeightDiff) issues.push("insufficient_side_bend");
    if (!properDirection) issues.push("not_bending_right");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            side_bend_angle: { value: sideBendAngle, rule: `>= ${sideBendAngleMin}° from baseline` },
            shoulder_height_diff: { value: shoulderHeightDiff, rule: `>= ${shoulderHeightDiffMin} (shoulder tilt)` },
            bending_right: { value: bendingRight, rule: "true (right shoulder lower)" },
            left_arm_overhead: { value: leftArmStillUp, rule: "true (maintained position)" },
            current_shoulder_angle: { value: currentShoulderAngle, rule: "current measurement" },
            baseline_shoulder_angle: { value: baselineShoulderAngle, rule: "reference angle" }
        }
    };
}

// Exercise workflow definition
const SEATED_SIDE_BEND_WORKFLOW = {
    name: "Seated Side Bend",
    description: "Raise one arm overhead and lean torso sideways to stretch the opposite side.",
    holdDuration: 3000, // 3 seconds per step
    steps: [
        {
            name: "Sit upright and establish neutral position",
            checkFunction: checkSideBendInitial,
            instruction: "Sit tall with shoulders level and arms relaxed at your sides"
        },
        {
            name: "Raise right arm overhead",
            checkFunction: checkSideBendArmUp,
            instruction: "Lift your right arm straight up overhead, keeping left arm down"
        },
        {
            name: "Lean left to stretch right side",
            checkFunction: checkSideBendLeft,
            instruction: "Keeping right arm up, gently lean your torso to the left to stretch your right side"
        },
        {
            name: "Return to center",
            checkFunction: checkSideBendCenter,
            instruction: "Slowly return to center and lower your right arm back to neutral"
        },
        {
            name: "Raise left arm overhead",
            checkFunction: checkSideBendLeftArmUp,
            instruction: "Now lift your left arm straight up overhead, keeping right arm down"
        },
        {
            name: "Lean right to stretch left side",
            checkFunction: checkSideBendRight,
            instruction: "Keeping left arm up, gently lean your torso to the right to stretch your left side"
        }
    ]
};
