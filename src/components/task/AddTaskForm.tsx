import React, { useState } from 'react';
import { Task } from '../../types';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [energy, setEnergy] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      description: description || undefined,
      completed: false,
      priority,
      energy,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };
    
    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setEnergy('medium');
    setDueDate('');
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <h2>Add New Task</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select 
            id="priority" 
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="energy">Energy Required</label>
          <select 
            id="energy" 
            value={energy}
            onChange={(e) => setEnergy(e.target.value as 'low' | 'medium' | 'high')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="dueDate">Due Date (optional)</label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      
      <button type="submit" className="submit-btn">Add Task</button>
    </form>
  );
};

export default AddTaskForm; 