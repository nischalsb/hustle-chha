export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  energy: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergyLevel {
  level: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface MoodEntry {
  mood: 'stressed' | 'neutral' | 'motivated' | 'focused' | 'tired';
  timestamp: Date;
} 