// src/types/firebase.ts
import { Task, MoodEntry, EnergyLevel } from './index';

export interface FirebaseTask extends Task {
  userId: string;
}

export interface FirebaseMoodEntry extends MoodEntry {
  userId: string;
}

export interface FirebaseEnergyLevel extends EnergyLevel {
  userId: string;
}

export interface UserData {
  userId: string;
  taskCompletionOrder: string[];
  lastUpdated: Date;
}