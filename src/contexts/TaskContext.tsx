import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getTasksByEnergy: (energy: string) => Task[];
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  addTask: () => {},
  completeTask: () => {},
  deleteTask: () => {},
  getTasksByEnergy: () => [],
});

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  // Generate user-specific localStorage key
  const getStorageKey = () => {
    return `tasks_${userId || 'guest'}`;
  };

  // Load tasks from localStorage on mount or when user changes
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    const savedTasks = localStorage.getItem(getStorageKey());
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert string dates back to Date objects
        const processedTasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(processedTasks);
      } catch (error) {
        console.error('Failed to parse tasks from localStorage', error);
      }
    }
  }, [userId]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (userId) {
      localStorage.setItem(getStorageKey(), JSON.stringify(tasks));
    }
  }, [tasks, userId]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    };
    
    setTasks([...tasks, newTask]);
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date() } 
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getTasksByEnergy = (energyLevel: string) => {
    if (!energyLevel) return [];
    
    return tasks.filter(task => 
      !task.completed && 
      (
        (energyLevel === 'low' && task.energy === 'low') ||
        (energyLevel === 'medium' && ['low', 'medium'].includes(task.energy)) ||
        (energyLevel === 'high')
      )
    );
  };

  const value = {
    tasks,
    addTask,
    completeTask,
    deleteTask,
    getTasksByEnergy
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 