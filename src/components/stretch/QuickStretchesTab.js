import React, { useState } from 'react';
import { Typography, Button, Tag, Card, Space } from 'antd';
import { 
  PlayCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const QuickStretchesTab = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const exercises = [
    {
      name: "Neck Rolls",
      difficulty: "Easy",
      duration: "30 sec",
      instructions: [
        "Slowly rotate your head clockwise in a circular motion",
        "Reverse direction and rotate counterclockwise",
        "Keep your shoulders relaxed throughout the movement"
      ],
      image: "/images/exercise1.png"
    },
    {
      name: "Shoulder Shrugs",
      difficulty: "Easy",
      duration: "45 sec",
      instructions: [
        "Raise your shoulders slowly upward toward your ears",
        "Hold for 2-3 seconds, then lower them gently",
        "Repeat the movement in a controlled manner"
      ],
      image: "/images/exercise2.png"
    },
    {
      name: "Wrist Flexion",
      difficulty: "Easy",
      duration: "30 sec",
      instructions: [
        "Extend your arms forward with palms facing down",
        "Bend your wrists up and down gently",
        "Keep your fingers relaxed during the movement"
      ],
      image: "/images/exercise3.png"
    },
    {
      name: "Seated Twist",
      difficulty: "Intermediate",
      duration: "60 sec",
      instructions: [
        "Sit upright and place your hands on your shoulders",
        "Slowly twist your torso to the right, then to the left",
        "Keep your hips facing forward throughout the movement"
      ],
      image: "/images/exercise1.png"
    },
    {
      name: "Ankle Circles",
      difficulty: "Easy",
      duration: "40 sec",
      instructions: [
        "Lift one foot off the ground slightly",
        "Rotate your ankle in circular motions",
        "Switch to the other foot and repeat"
      ],
      image: "/images/exercise3.png"
    }
  ];

  const handleStart = (exerciseName) => {
    console.log(`Starting exercise: ${exerciseName}`);
    // Placeholder for future functionality
  };

  const handleSkip = () => {
    console.log(`Skipping exercise: ${currentExercise.name}`);
    nextExercise();
  };

  const nextExercise = () => {
    setCurrentIndex((prev) => (prev + 1) % exercises.length);
  };

  const goToExercise = (index) => {
    setCurrentIndex(index);
  };

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

  const currentExercise = exercises[currentIndex];

  return (
    <div style={{ padding: '16px 0' }}>

      {/* Main Exercise Card */}
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: 24,
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Exercise Image */}
        <div style={{ 
          width: '100%', 
          height: 400, 
          backgroundColor: '#f0f0f0',
          position: 'relative',
          overflow: 'hidden'
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

        {/* Exercise Content */}
        <div style={{ padding: '16px 24px' }}>
          {/* Exercise Header */}
          <div style={{ marginBottom: 12 }}>
            <Title level={3} style={{ marginBottom: 8, textAlign: 'center' }}>
              {currentExercise.name}
            </Title>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <Tag color={getDifficultyColor(currentExercise.difficulty)} size="large">
                {currentExercise.difficulty}
              </Tag>
              <Tag color="blue" size="large" icon={<ClockCircleOutlined />}>
                {currentExercise.duration}
              </Tag>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
              Instructions:
            </Text>
            <ul style={{ 
              margin: 0, 
              paddingLeft: 20,
              fontSize: 14,
              lineHeight: 1.6
            }}>
              {currentExercise.instructions.map((instruction, index) => (
                <li key={index} style={{ marginBottom: 8 }}>
                  <Text>{instruction}</Text>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large" align="center">
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStart(currentExercise.name)}
                style={{
                  height: 48,
                  fontSize: 16,
                  borderRadius: 8,
                  padding: '0 32px'
                }}
              >
                Start Exercise
              </Button>
              <Button
                type="link"
                size="large"
                onClick={handleSkip}
                style={{ textDecoration: 'underline' }}
              >
                Skip
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* Pagination Dots */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Space size={8}>
          {exercises.map((_, index) => (
            <div
              key={index}
              onClick={() => goToExercise(index)}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: index === currentIndex ? '#1890ff' : '#d9d9d9',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            />
          ))}
        </Space>
      </div>
    </div>
  );
};

export default QuickStretchesTab; 