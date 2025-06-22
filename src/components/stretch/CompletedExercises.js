import React from 'react';
import { Typography, List, Tag, Empty } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useExercise } from '../../context/ExerciseContext';

const { Title, Text } = Typography;

const CompletedExercises = () => {
  const { completedExercises } = useExercise();

  return (
    <div>
      <Title level={5} style={{ marginBottom: 16 }}>
        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
        Completed Exercises
      </Title>
      
      {completedExercises.length > 0 ? (
        <List
          size="small"
          dataSource={completedExercises}
          renderItem={(exercise) => (
            <List.Item key={exercise.id}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text strong>{exercise.name}</Text>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description="No exercises completed yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '20px 0' }}
        />
      )}
    </div>
  );
};

export default CompletedExercises; 