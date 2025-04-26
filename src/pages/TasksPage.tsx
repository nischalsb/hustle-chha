import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import TaskList from '../components/task/TaskList';
import AddTaskForm from '../components/task/AddTaskForm';
import { useTaskContext } from '../contexts/TaskContext';
import { Task } from '../types';

const TasksPage: React.FC = () => {
  const { tasks, addTask, completeTask, deleteTask } = useTaskContext();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  // Filter tasks based on current filter
  const getFilteredTasks = (): Task[] => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'pending':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };
  
  return (
    <Layout>
      <div className="tasks-page">
        <section className="tasks-header">
          <h1>Manage Your Tasks</h1>
          <p className="subtitle">Organize, prioritize, and accomplish your goals with elegance</p>
          <div className="spacer"></div>
          <div className="filter-controls">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </section>
        
        <div className="tasks-grid">
          <section className="task-list-section">
            <h2>Your Tasks</h2>
            <TaskList 
              tasks={getFilteredTasks()} 
              onCompleteTask={completeTask} 
              onDeleteTask={deleteTask} 
            />
          </section>
          
          <section className="add-task-section">
            <AddTaskForm onAddTask={addTask} />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default TasksPage; 