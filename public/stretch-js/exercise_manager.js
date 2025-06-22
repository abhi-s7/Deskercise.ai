// Generic exercise workflow manager
class ExerciseManager {
    constructor(workflow) {
        this.workflow = workflow;
        this.currentStep = 0;
        this.stepStartTime = null;
        this.stepHoldTime = 0;
        this.isComplete = false;
    }

    getCurrentStep() {
        if (this.isComplete) {
            return {
                name: "Exercise Complete! Well done!",
                instruction: `You have successfully completed the ${this.workflow.name} exercise.`,
                isComplete: true
            };
        }
        return this.workflow.steps[this.currentStep];
    }

    getTotalSteps() {
        return this.workflow.steps.length;
    }

    getCurrentStepNumber() {
        return this.currentStep + 1;
    }

    getHoldDuration() {
        return this.workflow.holdDuration;
    }

    processLandmarks(landmarks) {
        if (this.isComplete) return { ok: true, complete: true };

        const currentStep = this.workflow.steps[this.currentStep];
        const result = currentStep.checkFunction(landmarks);

        if (result.ok) {
            // Position is correct, start/continue timing
            if (this.stepStartTime === null) {
                this.stepStartTime = Date.now();
            }
            this.stepHoldTime = Date.now() - this.stepStartTime;

            // Check if held long enough
            if (this.stepHoldTime >= this.workflow.holdDuration) {
                // Move to next step
                this.currentStep++;
                this.stepStartTime = null;
                this.stepHoldTime = 0;

                if (this.currentStep >= this.workflow.steps.length) {
                    this.isComplete = true;
                }

                console.log(`✅ Step ${this.currentStep} completed`);
            }
        } else {
            // Position incorrect, reset timer
            this.stepStartTime = null;
            this.stepHoldTime = 0;
            console.log(`❌ Step ${this.currentStep + 1}:`, result.issues);
        }

        return {
            ok: result.ok,
            issues: result.issues,
            metrics: result.metrics,
            holding: this.stepStartTime !== null,
            remainingTime: this.stepStartTime ? Math.max(0, this.workflow.holdDuration - this.stepHoldTime) : this.workflow.holdDuration,
            complete: this.isComplete
        };
    }

    reset() {
        this.currentStep = 0;
        this.stepStartTime = null;
        this.stepHoldTime = 0;
        this.isComplete = false;
    }

    getProgressText() {
        if (this.isComplete) {
            return "";
        }

        let progressText = "";
        if (this.stepStartTime !== null) {
            const remaining = Math.max(0, this.workflow.holdDuration - this.stepHoldTime);
            progressText = ` - Hold for ${(remaining / 1000).toFixed(1)}s`;
        }
        return progressText;
    }
}

// Available exercise workflows
const AVAILABLE_EXERCISES = {
    'lateral_neck_tilt': () => {
        if (typeof LATERAL_NECK_TILT_WORKFLOW === 'undefined') {
            throw new Error('LATERAL_NECK_TILT_WORKFLOW not loaded');
        }
        return LATERAL_NECK_TILT_WORKFLOW;
    },
    'neck_rotation': () => {
        if (typeof NECK_ROTATION_WORKFLOW === 'undefined') {
            throw new Error('NECK_ROTATION_WORKFLOW not loaded');
        }
        return NECK_ROTATION_WORKFLOW;
    },
    'overhead_reach': () => {
        if (typeof OVERHEAD_REACH_WORKFLOW === 'undefined') {
            throw new Error('OVERHEAD_REACH_WORKFLOW not loaded');
        }
        return OVERHEAD_REACH_WORKFLOW;
    },
    'thoracic_extension': () => {
        if (typeof THORACIC_EXTENSION_WORKFLOW === 'undefined') {
            throw new Error('THORACIC_EXTENSION_WORKFLOW not loaded');
        }
        return THORACIC_EXTENSION_WORKFLOW;
    },    'shoulder_rolls': () => {
        if (typeof SHOULDER_ROLLS_WORKFLOW === 'undefined') {
            throw new Error('SHOULDER_ROLLS_WORKFLOW not loaded');
        }
        return SHOULDER_ROLLS_WORKFLOW;
    },
    'seated_side_bend': () => {
        if (typeof SEATED_SIDE_BEND_WORKFLOW === 'undefined') {
            throw new Error('SEATED_SIDE_BEND_WORKFLOW not loaded');
        }
        return SEATED_SIDE_BEND_WORKFLOW;
    }
};

// Function to get exercise workflow by name
function getExerciseWorkflow(exerciseName) {
    const workflowFactory = AVAILABLE_EXERCISES[exerciseName];
    if (!workflowFactory) {
        throw new Error(`Exercise "${exerciseName}" not found`);
    }
    return workflowFactory();
}

// Function to get available exercises (only those with loaded workflows)
function getAvailableExercises() {
    const available = [];
    for (const [key, factory] of Object.entries(AVAILABLE_EXERCISES)) {
        try {
            factory(); // Try to get the workflow
            available.push(key);
        } catch (error) {
            console.warn(`Exercise ${key} not available:`, error.message);
        }
    }
    return available;
}
