// src/services/taskService.ts
import { 
    collection, 
    addDoc, 
    doc, 
    getDoc,
    getDocs, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy,
    serverTimestamp,
    Timestamp,
    onSnapshot
  } from "firebase/firestore";
  import { db, auth } from "../firebase";
  import { Task } from "../types";
  
  // Collection references
  const TASKS_COLLECTION = "tasks";
  
  // Add a new task
  export const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Prepare the task object
      const task = {
        ...taskData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
  
      // Add to Firestore
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), task);
      
      // Return the new task with ID
      return {
        id: docRef.id,
        ...taskData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };
  
  // Get all tasks for current user
  export const getUserTasks = async (): Promise<Task[]> => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Create query
      const q = query(
        collection(db, TASKS_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
  
      // Execute query
      const querySnapshot = await getDocs(q);
      
      // Format results
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          completed: data.completed,
          priority: data.priority,
          dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : undefined,
          energy: data.energy,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate()
        } as Task;
      });
    } catch (error) {
      console.error("Error getting tasks:", error);
      throw error;
    }
  };
  
  // Subscribe to real-time updates for user's tasks
  export const subscribeTasks = (callback: (tasks: Task[]) => void) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return () => {}; // Return empty unsubscribe function
    }
  
    const q = query(
      collection(db, TASKS_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          completed: data.completed,
          priority: data.priority,
          dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : undefined,
          energy: data.energy,
          createdAt: (data.createdAt as Timestamp).toDate(),
          updatedAt: (data.updatedAt as Timestamp).toDate()
        } as Task;
      });
      
      callback(tasks);
    });
  };
  
  // Update a task
  export const updateTask = async (taskId: string, updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Check if task exists and belongs to user
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      const taskSnap = await getDoc(taskRef);
      
      if (!taskSnap.exists()) throw new Error("Task not found");
      if (taskSnap.data().userId !== user.uid) throw new Error("Not authorized to update this task");
  
      // Update the task
      await updateDoc(taskRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
  
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };
  
  // Toggle task completion status
  export const toggleTaskCompletion = async (taskId: string) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Get current task state
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      const taskSnap = await getDoc(taskRef);
      
      if (!taskSnap.exists()) throw new Error("Task not found");
      if (taskSnap.data().userId !== user.uid) throw new Error("Not authorized to update this task");
  
      // Toggle completion status
      const newStatus = !taskSnap.data().completed;
      
      // Update the task
      await updateDoc(taskRef, {
        completed: newStatus,
        updatedAt: serverTimestamp()
      });
  
      // If task is completed, record it in user's completion history
      if (newStatus) {
        await recordTaskCompletion(taskId);
      }
  
      return newStatus;
    } catch (error) {
      console.error("Error toggling task completion:", error);
      throw error;
    }
  };
  
  // Record task completion for ML purposes
  const recordTaskCompletion = async (taskId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
  
      // Get user data document
      const userDataRef = doc(db, "userData", user.uid);
      const userDataSnap = await getDoc(userDataRef);
  
      if (userDataSnap.exists()) {
        // Update existing record
        await updateDoc(userDataRef, {
          taskCompletionOrder: [...(userDataSnap.data().taskCompletionOrder || []), taskId],
          lastUpdated: serverTimestamp()
        });
      } else {
        // Create new record
        await updateDoc(userDataRef, {
          userId: user.uid,
          taskCompletionOrder: [taskId],
          lastUpdated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error recording task completion:", error);
      // Don't throw - this is a background operation
    }
  };
  
  // Delete a task
  export const deleteTask = async (taskId: string) => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      // Check if task exists and belongs to user
      const taskRef = doc(db, TASKS_COLLECTION, taskId);
      const taskSnap = await getDoc(taskRef);
      
      if (!taskSnap.exists()) throw new Error("Task not found");
      if (taskSnap.data().userId !== user.uid) throw new Error("Not authorized to delete this task");
  
      // Delete the task
      await deleteDoc(taskRef);
  
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };