import React, { createContext, useContext, useState, useEffect } from 'react';
import { MoodEntry, EnergyLevel } from '../types';
import { useAuth } from './AuthContext';

interface MoodEnergyContextType {
  moodHistory: MoodEntry[];
  energyHistory: EnergyLevel[];
  currentEnergy: EnergyLevel | null;
  addMoodEntry: (mood: MoodEntry) => void;
  addEnergyEntry: (energy: EnergyLevel) => void;
}

const MoodEnergyContext = createContext<MoodEnergyContextType>({
  moodHistory: [],
  energyHistory: [],
  currentEnergy: null,
  addMoodEntry: () => {},
  addEnergyEntry: () => {}
});

export const useMoodEnergyContext = () => useContext(MoodEnergyContext);

export const MoodEnergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [energyHistory, setEnergyHistory] = useState<EnergyLevel[]>([]);
  const [currentEnergy, setCurrentEnergy] = useState<EnergyLevel | null>(null);

  // Generate user-specific localStorage keys
  const getMoodStorageKey = () => {
    return `moodHistory_${userId || 'guest'}`;
  };

  const getEnergyStorageKey = () => {
    return `energyHistory_${userId || 'guest'}`;
  };

  // Load mood and energy data from localStorage when user changes
  useEffect(() => {
    if (!userId) {
      // Reset data for guest users
      setMoodHistory([]);
      setEnergyHistory([]);
      setCurrentEnergy(null);
      return;
    }

    const savedMoodHistory = localStorage.getItem(getMoodStorageKey());
    const savedEnergyHistory = localStorage.getItem(getEnergyStorageKey());
    
    if (savedMoodHistory) {
      try {
        setMoodHistory(JSON.parse(savedMoodHistory));
      } catch (error) {
        console.error('Failed to parse mood history from localStorage', error);
      }
    }
    
    if (savedEnergyHistory) {
      try {
        const parsedEnergyHistory = JSON.parse(savedEnergyHistory);
        setEnergyHistory(parsedEnergyHistory);
        
        // Set current energy to the most recent
        if (parsedEnergyHistory.length > 0) {
          setCurrentEnergy(parsedEnergyHistory[parsedEnergyHistory.length - 1]);
        }
      } catch (error) {
        console.error('Failed to parse energy history from localStorage', error);
      }
    }
  }, [userId]);
  
  // Save mood history to localStorage when it changes
  useEffect(() => {
    if (userId && moodHistory.length > 0) {
      localStorage.setItem(getMoodStorageKey(), JSON.stringify(moodHistory));
    }
  }, [moodHistory, userId]);
  
  // Save energy history to localStorage when it changes
  useEffect(() => {
    if (userId && energyHistory.length > 0) {
      localStorage.setItem(getEnergyStorageKey(), JSON.stringify(energyHistory));
    }
  }, [energyHistory, userId]);
  
  const addMoodEntry = (mood: MoodEntry) => {
    setMoodHistory([...moodHistory, mood]);
  };
  
  const addEnergyEntry = (energy: EnergyLevel) => {
    setEnergyHistory([...energyHistory, energy]);
    setCurrentEnergy(energy);
  };

  const value = {
    moodHistory,
    energyHistory,
    currentEnergy,
    addMoodEntry,
    addEnergyEntry
  };

  return (
    <MoodEnergyContext.Provider value={value}>
      {children}
    </MoodEnergyContext.Provider>
  );
}; 