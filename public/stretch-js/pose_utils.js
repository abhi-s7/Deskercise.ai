// Shared pose tracking utilities for all exercises
const KEYMAPPER = {
    0:"nose",1:"left_eye_inner",2:"left_eye",3:"left_eye_outer",4:"right_eye_inner",
    5:"right_eye",6:"right_eye_outer",7:"left_ear",8:"right_ear",9:"mouth_left",
    10:"mouth_right",11:"left_shoulder",12:"right_shoulder",13:"left_elbow",
    14:"right_elbow",15:"left_wrist",16:"right_wrist",17:"left_pinky",18:"right_pinky",
    19:"left_index",20:"right_index",21:"left_thumb",22:"right_thumb",23:"left_hip",
    24:"right_hip",25:"left_knee",26:"right_knee",27:"left_ankle",28:"right_ankle",
    29:"left_heel",30:"right_heel",31:"left_foot_index",32:"right_foot_index"
};

// quick reverse lookup: name → index
const NAME2IDX = Object.fromEntries(
    Object.entries(KEYMAPPER).map(([i,n]) => [n, parseInt(i,10)])
);

// --- maths helpers -------------------------------------------------------
const deg = rad => rad * 180 / Math.PI;

function angleBetween(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.abs(deg(Math.atan2(dy, dx)));   // |angle w.r.t. +x|
}

function signedAngleBetween(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return deg(Math.atan2(dy, dx));   // signed angle w.r.t. +x
}

function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Common check function used by multiple exercises
function checkInitialPosition(lms, shoulderTol = 10, headTol = 10) {
    const xy = name => lms[NAME2IDX[name]];          // landmark accessor

    // measurements
    const shoulderAngle = angleBetween(xy("right_shoulder"), xy("left_shoulder"));
    const headAngle = angleBetween(xy("right_eye"), xy("left_eye"));

    const issues = [];
    if (shoulderAngle > shoulderTol) issues.push("shoulders_not_level");
    if (headAngle > headTol) issues.push("head_not_level");

    return {
        ok: issues.length === 0,
        issues,
        metrics: {
            shoulder_angle: { value: shoulderAngle, rule: `abs <= ${shoulderTol}` },
            head_angle: { value: headAngle, rule: `abs <= ${headTol}` }
        }
    };
}
