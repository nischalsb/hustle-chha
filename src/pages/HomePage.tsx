import React from 'react';
import Layout from '../components/layout/Layout';
import TaskList from '../components/task/TaskList';
import MoodTracker from '../components/task/MoodTracker';
import { useTaskContext } from '../contexts/TaskContext';
import { useMoodEnergyContext } from '../contexts/MoodEnergyContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const HomePage: React.FC = () => {
  const { tasks, completeTask, deleteTask } = useTaskContext();
  const { 
    moodHistory, 
    energyHistory, 
    currentEnergy, 
    addMoodEntry, 
    addEnergyEntry 
  } = useMoodEnergyContext();
  const { userProfile } = useUserProfile();
  
  // Function to get tasks that match current energy level
  const getRecommendedTasks = () => {
    if (!currentEnergy) return [];
    
    return tasks.filter(task => 
      !task.completed && 
      (
        (currentEnergy.level === 'low' && task.energy === 'low') ||
        (currentEnergy.level === 'medium' && ['low', 'medium'].includes(task.energy)) ||
        (currentEnergy.level === 'high')
      )
    );
  };
  
  // Format the header text based on user profile
  const getHeaderText = () => {
    if (userProfile && userProfile.firstName) {
      return `${userProfile.firstName}'s Productivity Dashboard`;
    }
    return 'Your Productivity Dashboard';
  };
  
  return (
    <Layout>
      <div className="dashboard">
        <section className="dashboard-header">
          <h1>{getHeaderText()}</h1>
          <p>Track your tasks, mood, and energy levels all in one place.</p>
        </section>
        
        <div className="dashboard-grid">
          <section className="mood-energy-section">
            <MoodTracker 
              onMoodUpdate={addMoodEntry} 
              onEnergyUpdate={addEnergyEntry} 
            />
          </section>
          
          {currentEnergy && (
            <section className="recommendations-section">
              <h2>Recommended Tasks Based on Your Energy</h2>
              <p>Current energy level: <strong>{currentEnergy.level}</strong></p>
              <TaskList 
                tasks={getRecommendedTasks()} 
                onCompleteTask={completeTask} 
                onDeleteTask={deleteTask} 
              />
            </section>
          )}
          
          <section className="progress-section">
            <h2>Today's Progress</h2>
            <div className="progress-stats">
              <div className="stat-box">
                <h3>Completed Tasks</h3>
                <span className="stat-number">{tasks.filter(task => task.completed).length}</span>
              </div>
              <div className="stat-box">
                <h3>Pending Tasks</h3>
                <span className="stat-number">{tasks.filter(task => !task.completed).length}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage; 