import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

interface UserProfileContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const UserProfileContext = createContext<UserProfileContextType>({
  userProfile: null,
  loading: true,
  error: null
});

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || currentUser.email || '',
            createdAt: userData.createdAt?.toDate() || new Date()
          });
        } else {
          // If no document exists but user is authenticated
          // Create a default profile with email only
          setUserProfile({
            firstName: '',
            lastName: '',
            email: currentUser.email || '',
            createdAt: new Date()
          });
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const value = {
    userProfile,
    loading,
    error
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}; 