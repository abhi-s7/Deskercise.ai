import React, { useState, useEffect } from 'react';
import { Typography, Button, Tag, Card, Space, Spin } from 'antd';
import { 
  ClockCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const QuickStretchesTab = ({ selectedExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load exercise data from the iframe/stretch system
  useEffect(() => {
    const loadExercises = async () => {
      try {
        // Fallback exercise data in case iframe loading fails
        const fallbackExercises = [
          {
            key: 'neck_rotation',
            name: 'Neck Rotation',
            description: 'Turn your head to look over one shoulder without moving your torso.',
            difficulty: 'Easy',
            duration: '9 sec',
            instructions: [
              'Sit tall with spine neutral, shoulders level',
              'Slowly rotate your head to the right until you feel a stretch',
              'Slowly rotate your head to the left until you feel a stretch'
            ],
            image: "/images/exercise1.png"
          },
          {
            key: 'lateral_neck_tilt',
            name: 'Lateral Neck Tilt', 
            description: 'Drop one ear toward the same-side shoulder while sitting tall.',
            difficulty: 'Easy',
            duration: '6 sec',
            instructions: [
              'Sit upright with shoulders level and head straight',
              'Slowly tilt your head so your right ear approaches your right shoulder',
              'Slowly tilt your head so your left ear approaches your left shoulder'
            ],
            image: "/images/exercise2.png"
          },
          {
            key: 'seated_side_bend',
            name: 'Seated Side Bend',
            description: 'Raise one arm overhead and lean torso sideways to stretch the opposite side.',
            difficulty: 'Intermediate',
            duration: '18 sec',
            instructions: [
              'Sit tall with shoulders level and arms relaxed at your sides',
              'Lift your left arm straight up overhead, keeping right arm down',
              'Keeping left arm up, gently lean your torso to the right to stretch your left side',
              'Slowly return to center and lower your left arm back to neutral',
              'Now lift your right arm straight up overhead, keeping left arm down',
              'Keeping right arm up, gently lean your torso to the left to stretch your right side'
            ],
            image: "/images/exercise3.png"
          },
          {
            key: 'overhead_reach',
            name: 'Overhead Reach',
            description: 'Reach both arms overhead to stretch your shoulders and upper back.',
            difficulty: 'Easy',
            duration: '6 sec',
            instructions: [
              'Sit upright with shoulders level and head straight',
              'Raise both arms overhead with fingers interlocked'
            ],
            image: "/images/exercise1.png"
          },
          {
            key: 'thoracic_extension',
            name: 'Thoracic Extension',
            description: 'Extend your upper back while keeping your core engaged.',
            difficulty: 'Intermediate',
            duration: '6 sec',
            instructions: [
              'Sit upright with shoulders level and head straight',
              'Place hands behind head and gently arch your upper back'
            ],
            image: "/images/exercise2.png"
          },
          {
            key: 'shoulder_rolls',
            name: 'Shoulder Rolls',
            description: 'Roll your shoulders to release tension in the upper back.',
            difficulty: 'Easy',
            duration: '9 sec',
            instructions: [
              'Sit upright with shoulders level and relaxed in neutral position',
              'Roll shoulders forward in a circular motion',
              'Roll shoulders backward in a circular motion'
            ],
            image: "/images/exercise3.png"
          }
        ];

        // Create a temporary iframe to access the exercise data
        const iframe = document.createElement('iframe');
        iframe.src = '/stretch-js/stretch-iframe.html';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Set a timeout to use fallback data if iframe takes too long
        const fallbackTimeout = setTimeout(() => {
          console.log('Using fallback exercise data');
          setExercises(fallbackExercises);
          setLoading(false);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 3000);

        iframe.onload = () => {
          try {
            const iframeWindow = iframe.contentWindow;
            
            // Wait a bit for scripts to load
            setTimeout(() => {
              try {
                // Check if the functions exist before calling them
                if (!iframeWindow || !iframeWindow.getAvailableExercises || !iframeWindow.getExerciseWorkflow) {
                  console.error('Required functions not available in iframe');
                  setLoading(false);
                  document.body.removeChild(iframe);
                  return;
                }
                
                const availableExercises = iframeWindow.getAvailableExercises();
                const exerciseData = [];

                availableExercises.forEach(exerciseKey => {
                  try {
                    const workflow = iframeWindow.getExerciseWorkflow(exerciseKey);
                    
                    // Validate workflow object
                    if (!workflow || !workflow.name || !workflow.steps || !Array.isArray(workflow.steps)) {
                      console.warn(`Invalid workflow for exercise ${exerciseKey}`);
                      return;
                    }
                    
                    // Calculate estimated duration (holdDuration * steps)
                    const totalDuration = Math.round((workflow.holdDuration * workflow.steps.length) / 1000);
                    
                    // Get difficulty based on number of steps and complexity
                    const getDifficulty = () => {
                      if (workflow.steps.length <= 3) return 'Easy';
                      if (workflow.steps.length <= 5) return 'Intermediate';
                      return 'Advanced';
                    };

                    exerciseData.push({
                      key: exerciseKey,
                      name: workflow.name || 'Unknown Exercise',
                      description: workflow.description || '',
                      difficulty: getDifficulty(),
                      duration: `${totalDuration} sec`,
                      instructions: workflow.steps.map(step => step.instruction || 'No instruction available'),
                      holdDuration: workflow.holdDuration || 3000,
                      steps: workflow.steps,
                      image: "/images/exercise1.png" // Default image for now
                    });
                  } catch (error) {
                    console.warn(`Error loading exercise ${exerciseKey}:`, error);
                  }
                });

                setExercises(exerciseData);
                setLoading(false);
                
                // Clear fallback timeout since we succeeded
                clearTimeout(fallbackTimeout);
                
                // Clean up iframe
                document.body.removeChild(iframe);
              } catch (error) {
                console.error('Error accessing iframe functions:', error);
                clearTimeout(fallbackTimeout);
                setLoading(false);
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe);
                }
              }
            }, 1000);
          } catch (error) {
            console.error('Error in iframe onload:', error);
            clearTimeout(fallbackTimeout);
            setLoading(false);
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }
        };

        iframe.onerror = () => {
          console.error('Error loading stretch iframe');
          clearTimeout(fallbackTimeout);
          setLoading(false);
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        };

      } catch (error) {
        console.error('Error loading exercises:', error);
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'red';
      default:
        return 'blue';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading exercises...</Text>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Text type="secondary">No exercises available</Text>
      </div>
    );
  }

  // Find the exercise to display based on selectedExercise prop
  const currentExercise = selectedExercise 
    ? exercises.find(ex => ex.key === selectedExercise)
    : null;

  return (
    <div style={{ padding: '8px 0' }}> {/* Reduced padding for smaller height */}
      {/* Main Exercise Card */}
      <Card
        style={{
          borderRadius: 12, // Smaller border radius
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Smaller shadow
          marginBottom: 16, // Reduced margin
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 12 }} // Reduced padding
      >
        {currentExercise ? (
          /* Image Left, Content Right Layout */
          <div style={{ display: 'flex', gap: 16 }}>
            {/* Exercise Image - Left Side */}
            <div style={{ 
              width: 150, // Fixed width for image
              height: 120, // Fixed height for image
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img
                src={currentExercise.image}
                alt={currentExercise.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Exercise Content - Right Side */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Exercise Header */}
              <div style={{ marginBottom: 8 }}>
                <Title level={4} style={{ marginBottom: 4, fontSize: 16 }}>
                  {currentExercise.name}
                </Title>
                
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Tag color={getDifficultyColor(currentExercise.difficulty)} size="small">
                    {currentExercise.difficulty}
                  </Tag>
                  <Tag color="blue" size="small" icon={<ClockCircleOutlined />}>
                    {currentExercise.duration}
                  </Tag>
                </div>

                {/* Exercise Description */}
                {currentExercise.description && (
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.3 }}>
                      {currentExercise.description}
                    </Text>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div>
                <Text strong style={{ fontSize: 13, marginBottom: 6, display: 'block' }}>
                  Instructions:
                </Text>
                <ol style={{ 
                  margin: 0, 
                  paddingLeft: 16,
                  fontSize: 12,
                  lineHeight: 1.4
                }}>
                  {currentExercise.instructions.slice(0, 4).map((instruction, index) => ( // Limit to 4 instructions
                    <li key={index} style={{ marginBottom: 4 }}>
                      <Text style={{ fontSize: 12 }}>{instruction}</Text>
                    </li>
                  ))}
                  {currentExercise.instructions.length > 4 && (
                    <li style={{ marginBottom: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ...and {currentExercise.instructions.length - 4} more steps
                      </Text>
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <PlayCircleOutlined style={{ fontSize: 32, color: '#bfbfbf' }} />
            </div>
            <Title level={4} style={{ marginBottom: 8, color: '#8c8c8c' }}>
              No Exercise Selected
            </Title>
            <Text type="secondary" style={{ fontSize: 14 }}>
              Choose an exercise from the dropdown above to see detailed instructions and guidance.
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuickStretchesTab; 