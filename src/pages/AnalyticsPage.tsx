import React from 'react';
import Layout from '../components/layout/Layout';
import { useTaskContext } from '../contexts/TaskContext';
import { useMoodEnergyContext } from '../contexts/MoodEnergyContext';
import { useUserProfile } from '../contexts/UserProfileContext';

const AnalyticsPage: React.FC = () => {
  const { tasks } = useTaskContext();
  const { moodHistory, energyHistory } = useMoodEnergyContext();
  const { userProfile } = useUserProfile();
  
  // Calculate completion rate
  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  
  // Calculate most common mood
  const getMostCommonMood = () => {
    if (moodHistory.length === 0) return 'No data';
    
    const moodCounts: Record<string, number> = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    let mostCommonMood = '';
    let highestCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        mostCommonMood = mood;
        highestCount = count;
      }
    });
    
    return mostCommonMood;
  };
  
  // Calculate average energy level
  const getAverageEnergyLevel = () => {
    if (energyHistory.length === 0) return 'No data';
    
    const energyMap = { 'low': 1, 'medium': 2, 'high': 3 };
    const totalEnergy = energyHistory.reduce((sum, entry) => {
      return sum + (energyMap[entry.level] || 0);
    }, 0);
    
    const average = totalEnergy / energyHistory.length;
    
    if (average <= 1.5) return 'low';
    if (average <= 2.5) return 'medium';
    return 'high';
  };
  
  // Get tasks completed by priority
  const getTasksByPriority = () => {
    const completedTasks = tasks.filter(task => task.completed);
    const priorityCounts = {
      low: completedTasks.filter(task => task.priority === 'low').length,
      medium: completedTasks.filter(task => task.priority === 'medium').length,
      high: completedTasks.filter(task => task.priority === 'high').length
    };
    
    return priorityCounts;
  };
  
  const priorityCounts = getTasksByPriority();
  const completionRate = getCompletionRate();
  
  // Format the header text based on user profile
  const getHeaderText = () => {
    if (userProfile && userProfile.firstName) {
      return `${userProfile.firstName}'s Productivity Analytics`;
    }
    return 'Your Productivity Analytics';
  };
  
  return (
    <Layout>
      <div className="analytics-page">
        <section className="analytics-header">
          <h1>{getHeaderText()}</h1>
          <p>Gain insights into your productivity patterns and mood trends.</p>
        </section>
        
        <div className="analytics-grid">
          <section className="analytics-card task-completion">
            <h2>Task Completion</h2>
            <div className="stat-circle" style={{"--percentage": completionRate} as React.CSSProperties}>
              <span className="stat-percentage">{completionRate}%</span>
            </div>
            <p>Tasks Completed: {tasks.filter(task => task.completed).length}/{tasks.length}</p>
          </section>
          
          <section className="analytics-card mood-analysis">
            <h2>Mood Analysis</h2>
            <div className="stat-box">
              <h3>Most Common Mood</h3>
              <p className="stat-value">{getMostCommonMood()}</p>
            </div>
            <p>Based on {moodHistory.length} mood entries</p>
          </section>
          
          <section className="analytics-card energy-analysis">
            <h2>Energy Analysis</h2>
            <div className="stat-box">
              <h3>Average Energy Level</h3>
              <p className="stat-value">{getAverageEnergyLevel()}</p>
            </div>
            <p>Based on {energyHistory.length} energy readings</p>
          </section>
          
          <section className="analytics-card priority-analysis">
            <h2>Tasks Completed by Priority</h2>
            <div className="priority-bars">
              <div className="priority-bar">
                <span className="priority-label">High</span>
                <div className="bar-container">
                  <div className="bar high" style={{ width: `${(priorityCounts.high / (tasks.length || 1)) * 100}%` }}></div>
                </div>
                <span className="count">{priorityCounts.high}</span>
              </div>
              <div className="priority-bar">
                <span className="priority-label">Medium</span>
                <div className="bar-container">
                  <div className="bar medium" style={{ width: `${(priorityCounts.medium / (tasks.length || 1)) * 100}%` }}></div>
                </div>
                <span className="count">{priorityCounts.medium}</span>
              </div>
              <div className="priority-bar">
                <span className="priority-label">Low</span>
                <div className="bar-container">
                  <div className="bar low" style={{ width: `${(priorityCounts.low / (tasks.length || 1)) * 100}%` }}></div>
                </div>
                <span className="count">{priorityCounts.low}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage; 