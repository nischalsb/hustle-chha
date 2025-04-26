import React from 'react';
import { Task as TaskType } from '../../types';
import Task from './Task';

interface TaskListProps {
  tasks: TaskType[];
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onCompleteTask, 
  onDeleteTask 
}) => {
  if (tasks.length === 0) {
    return <div className="empty-tasks">No tasks found. Add some tasks to get started!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <Task 
          key={task.id} 
          task={task} 
          onComplete={onCompleteTask} 
          onDelete={onDeleteTask} 
        />
      ))}
    </div>
  );
};

export default TaskList; 