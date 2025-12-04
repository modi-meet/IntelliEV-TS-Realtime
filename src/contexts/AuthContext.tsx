import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { auth, db } from "../services/firebase";

interface AuthContextType {
  currentUser: (User & DocumentData) | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<(User & DocumentData) | null>(null);
  const [loading, setLoading] = useState(true);

  // This listener fires whenever the Auth State changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in, now fetch their role/profile from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // combine with old data
            setCurrentUser({ ...user, ...userDoc.data() } as User & DocumentData);
          } else {
            // Auth exists but Firestore doc is missing
            setCurrentUser(user as User & DocumentData);
          }
        } else {
          // User is signed out
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}