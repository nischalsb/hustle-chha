import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

// Sign up with email/password
export const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store user profile data in Firestore
    if (firstName || lastName) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        createdAt: new Date()
      });
    }
    
    return user;
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
    const user = userCredential.user;
    
    // Check if user profile already exists
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    // If user doesn't exist in Firestore, create profile from Google data
    if (!userDoc.exists()) {
      const displayName = user.displayName || '';
      let firstName = '';
      let lastName = '';
      
      // Try to parse first and last name from display name
      if (displayName) {
        const nameParts = displayName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      await setDoc(userDocRef, {
        email: user.email,
        firstName,
        lastName,
        createdAt: new Date()
      });
    }
    
    return user;
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