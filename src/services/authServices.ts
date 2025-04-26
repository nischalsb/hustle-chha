// src/services/authService.ts
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    User
  } from "firebase/auth";
  import { auth } from "../firebase";
  
  // Sign up with email/password
  export const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };
  
  // Sign in with email/password
  export const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential.user;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };
  
  // Sign out
  export const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };
  
  // Get current user
  export const getCurrentUser = (): User | null => {
    return auth.currentUser;
  };
  
  // Subscribe to auth state changes
  export const onAuthStateChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  };