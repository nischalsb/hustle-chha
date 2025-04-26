// src/services/moodEnergyService.ts
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    onSnapshot
  } from "firebase/firestore";
  import { db, auth } from "../firebase";
  import { MoodEntry, EnergyLevel } from "../types";
  
  // Collection references
  const MOOD_COLLECTION = "moodEntries";
  const ENERGY_COLLECTION = "energyLevels";
  
  // Add a new mood entry
  export const addMoodEntry = async (mood: MoodEntry["mood"]) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Create the mood entry
      const moodEntry = {
        userId: user.uid,
        mood,
        timestamp: serverTimestamp()
      };
  
      // Add to Firestore
      const docRef = await addDoc(collection(db, MOOD_COLLECTION), moodEntry);
      
      return {
        id: docRef.id,
        mood,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error adding mood entry:", error);
      throw error;
    }
  };
  
  // Add a new energy level entry
  export const addEnergyLevel = async (level: EnergyLevel["level"]) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Create the energy level entry
      const energyEntry = {
        userId: user.uid,
        level,
        timestamp: serverTimestamp()
      };
  
      // Add to Firestore
      const docRef = await addDoc(collection(db, ENERGY_COLLECTION), energyEntry);
      
      return {
        id: docRef.id,
        level,
        timestamp: new Date()
      };
    } catch (error) {
      console.error("Error adding energy level:", error);
      throw error;
    }
  };
  
  // Get mood history for current user
  export const getMoodHistory = async (): Promise<MoodEntry[]> => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Create query
      const q = query(
        collection(db, MOOD_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(100) // Get last 100 entries
      );
  
      // Execute query
      const querySnapshot = await getDocs(q);
      
      // Format results
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          mood: data.mood,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as MoodEntry & { id: string };
      });
    } catch (error) {
      console.error("Error getting mood history:", error);
      throw error;
    }
  };
  
  // Get energy history for current user
  export const getEnergyHistory = async (): Promise<EnergyLevel[]> => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Create query
      const q = query(
        collection(db, ENERGY_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(100) // Get last 100 entries
      );
  
      // Execute query
      const querySnapshot = await getDocs(q);
      
      // Format results
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          level: data.level,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as EnergyLevel & { id: string };
      });
    } catch (error) {
      console.error("Error getting energy history:", error);
      throw error;
    }
  };
  
  // Get current energy level
  export const getCurrentEnergy = async (): Promise<EnergyLevel | null> => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Create query to get most recent energy level
      const q = query(
        collection(db, ENERGY_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(1)
      );
  
      // Execute query
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      // Format result
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        level: data.level,
        timestamp: (data.timestamp as Timestamp).toDate()
      } as EnergyLevel & { id: string };
    } catch (error) {
      console.error("Error getting current energy:", error);
      throw error;
    }
  };
  
  // Subscribe to mood history updates
  export const subscribeMoodHistory = (callback: (moods: MoodEntry[]) => void) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return () => {}; // Return empty unsubscribe function
    }
  
    const q = query(
      collection(db, MOOD_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(100)
    );
  
    return onSnapshot(q, (querySnapshot) => {
      const moods = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          mood: data.mood,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as MoodEntry & { id: string };
      });
      
      callback(moods);
    });
  };
  
  // Subscribe to energy history updates
  export const subscribeEnergyHistory = (callback: (energy: EnergyLevel[]) => void) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return () => {}; // Return empty unsubscribe function
    }
  
    const q = query(
      collection(db, ENERGY_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(100)
    );
  
    return onSnapshot(q, (querySnapshot) => {
      const energyLevels = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          level: data.level,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as EnergyLevel & { id: string };
      });
      
      callback(energyLevels);
    });
  };