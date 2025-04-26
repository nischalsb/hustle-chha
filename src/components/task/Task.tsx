import React from 'react';
import { Task as TaskType } from '../../types';

interface TaskProps {
  task: TaskType;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, onComplete, onDelete }) => {
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className={`task ${task.completed ? 'completed' : ''}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-badges">
          <span className={`priority ${task.priority}`}>{task.priority}</span>
          <span className={`energy ${task.energy}`}>{task.energy}</span>
        </div>
      </div>
      
      {task.description && <p className="task-description">{task.description}</p>}
      
      <div className="task-footer">
        <span className="due-date">Due: {formatDate(task.dueDate)}</span>
        <div className="task-actions">
          <button 
            className="complete-btn"
            onClick={() => onComplete(task.id)}
          >
            {task.completed ? 'Undo' : 'Complete'}
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task; 