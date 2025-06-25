import React from 'react';
import { Typography, List, Tag, Empty } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useExercise } from '../../context/ExerciseContext';

const { Title, Text } = Typography;

const CompletedExercises = () => {
  const { completedExercises } = useExercise();

  return (
    <div>
      <Title level={5} style={{ marginBottom: 8, fontSize: 13 }}>
        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
        Completed Exercises
      </Title>
      
      {completedExercises.length > 0 ? (
        <List
          size="small"
          dataSource={completedExercises}
          renderItem={(exercise) => (
            <List.Item key={exercise.id} style={{ padding: '4px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <Text strong style={{ fontSize: 12 }}>{exercise.name}</Text>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description="No exercises completed yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '10px 0' }}
        />
      )}
    </div>
  );
};

export default CompletedExercises; 