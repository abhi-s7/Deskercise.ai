// Baseline shoulder position (set during check1)
let baselineShoulderToMouthDistance = null;

// returns { ok, issues[], metrics{} }
function checkShoulderRollInitial(lms, shoulderTol = 15, headTol = 10) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    // Standard initial position checks
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const headAngle = angleBetween(xy("right_eye"), xy("left_eye"));
    
    // Calculate baseline shoulder-to-mouth distance
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
    };
    
    // Use mouth midpoint as stable reference
    const leftMouth = xy("mouth_left");
    const rightMouth = xy("mouth_right");
    const mouthMidpoint = {
        x: (leftMouth.x + rightMouth.x) / 2,
        y: (leftMouth.y + rightMouth.y) / 2
    };
    
    const shoulderToMouthDistance = distance(shoulderMidpoint, mouthMidpoint);
    
    // Store baseline for comparison in subsequent checks
    baselineShoulderToMouthDistance = shoulderToMouthDistance;
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (headAngle > headTol) issues.push("head_not_level");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            head_angle: { value: headAngle, rule: `abs <= ${headTol}` },
            baseline_shoulder_to_mouth: { value: shoulderToMouthDistance, rule: "baseline established" },
            shoulder_midpoint: { value: shoulderMidpoint },
            mouth_midpoint: { value: mouthMidpoint }
        }
    };
}

// returns { ok, issues[], metrics{} }
function checkShoulderRollUp(lms, shoulderTol = 20, shrinkageMin = 0.02) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    
    // Calculate current shoulder-to-mouth distance
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
    };
    
    const leftMouth = xy("mouth_left");
    const rightMouth = xy("mouth_right");
    const mouthMidpoint = {
        x: (leftMouth.x + rightMouth.x) / 2,
        y: (leftMouth.y + rightMouth.y) / 2
    };
    
    const currentShoulderToMouthDistance = distance(shoulderMidpoint, mouthMidpoint);
    
    // Check if shoulders have moved up (distance should decrease)
    const distanceChange = baselineShoulderToMouthDistance - currentShoulderToMouthDistance;
    const shouldersRaisedEnough = distanceChange >= shrinkageMin;
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (!shouldersRaisedEnough) issues.push("shoulders_not_raised_enough");
    if (!baselineShoulderToMouthDistance) issues.push("baseline_not_established");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            current_distance: { value: currentShoulderToMouthDistance, rule: "current measurement" },
            baseline_distance: { value: baselineShoulderToMouthDistance, rule: "reference distance" },
            distance_change: { value: distanceChange, rule: `>= ${shrinkageMin} (shoulders up)` },
            shoulders_raised: { value: shouldersRaisedEnough, rule: "true (distance decreased)" }
        }
    };
}

// returns { ok, issues[], metrics{} }
function checkShoulderRollDown(lms, shoulderTol = 20, elongationMin = 0.01) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor
    
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    
    // Calculate current shoulder-to-mouth distance
    const leftShoulder = xy("left_shoulder");
    const rightShoulder = xy("right_shoulder");
    const shoulderMidpoint = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
    };
    
    const leftMouth = xy("mouth_left");
    const rightMouth = xy("mouth_right");
    const mouthMidpoint = {
        x: (leftMouth.x + rightMouth.x) / 2,
        y: (leftMouth.y + rightMouth.y) / 2
    };
    
    const currentShoulderToMouthDistance = distance(shoulderMidpoint, mouthMidpoint);
    
    // Check if shoulders have moved down (distance should increase from baseline)
    const distanceChange = currentShoulderToMouthDistance - baselineShoulderToMouthDistance;
    const shouldersLoweredEnough = distanceChange >= elongationMin;
    
    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (!shouldersLoweredEnough) issues.push("shoulders_not_lowered_enough");
    if (!baselineShoulderToMouthDistance) issues.push("baseline_not_established");
    
    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            current_distance: { value: currentShoulderToMouthDistance, rule: "current measurement" },
            baseline_distance: { value: baselineShoulderToMouthDistance, rule: "reference distance" },
            distance_change: { value: distanceChange, rule: `>= ${elongationMin} (shoulders down)` },
            shoulders_lowered: { value: shouldersLoweredEnough, rule: "true (distance increased)" }
        }
    };
}

// Exercise workflow definition
const SHOULDER_ROLLS_WORKFLOW = {
    name: "Shoulder Rolls",
    description: "Slow circular shrug: up, down.",
    holdDuration: 3000, // 2 seconds per step
    steps: [
        {
            name: "Position yourself straight and establish baseline",
            checkFunction: checkShoulderRollInitial,
            instruction: "Sit upright with shoulders level and relaxed in neutral position"
        },
        {
            name: "Lift shoulders up toward ears",
            checkFunction: checkShoulderRollUp,
            instruction: "Slowly lift your shoulders up toward your ears"
        },
        {
            name: "Lower shoulders back down",
            checkFunction: checkShoulderRollDown,
            instruction: "Slowly lower your shoulders back down, extending them below baseline"
        }
    ]
};
