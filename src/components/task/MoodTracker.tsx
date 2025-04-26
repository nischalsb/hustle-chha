import React, { useState } from 'react';
import { MoodEntry, EnergyLevel } from '../../types';

interface MoodTrackerProps {
  onMoodUpdate: (mood: MoodEntry) => void;
  onEnergyUpdate: (energy: EnergyLevel) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodUpdate, onEnergyUpdate }) => {
  const [mood, setMood] = useState<MoodEntry['mood']>('neutral');
  const [energy, setEnergy] = useState<EnergyLevel['level']>('medium');

  const handleMoodUpdate = () => {
    const moodEntry: MoodEntry = {
      mood,
      timestamp: new Date()
    };
    onMoodUpdate(moodEntry);
  };

  const handleEnergyUpdate = () => {
    const energyLevel: EnergyLevel = {
      level: energy,
      timestamp: new Date()
    };
    onEnergyUpdate(energyLevel);
  };

  return (
    <div className="mood-tracker">
      <h2>How are you feeling?</h2>
      
      <div className="tracker-section">
        <h3>Current Mood</h3>
        <div className="mood-options">
          <button 
            className={`mood-btn ${mood === 'stressed' ? 'active' : ''}`}
            onClick={() => setMood('stressed')}
          >
            😩 Stressed
          </button>
          <button 
            className={`mood-btn ${mood === 'tired' ? 'active' : ''}`}
            onClick={() => setMood('tired')}
          >
            😴 Tired
          </button>
          <button 
            className={`mood-btn ${mood === 'neutral' ? 'active' : ''}`}
            onClick={() => setMood('neutral')}
          >
            😐 Neutral
          </button>
          <button 
            className={`mood-btn ${mood === 'motivated' ? 'active' : ''}`}
            onClick={() => setMood('motivated')}
          >
            😃 Motivated
          </button>
          <button 
            className={`mood-btn ${mood === 'focused' ? 'active' : ''}`}
            onClick={() => setMood('focused')}
          >
            🧠 Focused
          </button>
        </div>
        <button 
          className="update-btn"
          onClick={handleMoodUpdate}
        >
          Update Mood
        </button>
      </div>
      
      <div className="tracker-section">
        <h3>Energy Level</h3>
        <div className="energy-slider">
          <label>
            <input
              type="radio"
              name="energy"
              value="low"
              checked={energy === 'low'}
              onChange={() => setEnergy('low')}
            />
            Low
          </label>
          <label>
            <input
              type="radio"
              name="energy"
              value="medium"
              checked={energy === 'medium'}
              onChange={() => setEnergy('medium')}
            />
            Medium
          </label>
          <label>
            <input
              type="radio"
              name="energy"
              value="high"
              checked={energy === 'high'}
              onChange={() => setEnergy('high')}
            />
            High
          </label>
        </div>
        <button 
          className="update-btn"
          onClick={handleEnergyUpdate}
        >
          Update Energy
        </button>
      </div>
    </div>
  );
};

export default MoodTracker; 