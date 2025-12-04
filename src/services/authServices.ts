import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  DocumentData
} from "firebase/firestore";

import { auth, db } from "./firebase";

interface RegisterUserParams {
  email: string;
  password: string;
  username: string;
  regNumber: string;
  userType: 'ev' | 'emergency';
}

/**
 * Handles the user signup process.
 */
export async function registerUser({ email, password, username, regNumber, userType }: RegisterUserParams): Promise<User> {
  if (!email || !password || !username || !regNumber) {
    throw new Error("Please fill all fields.");
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save additional user info to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      username,
      email,
      regNumber: regNumber.toUpperCase(),
      userType,
    });

    return userCredential.user;

  } catch (error: any) {
    throw new Error(`Sign up failed: ${error.message}`);
  }
}

/**
 * Handles the user login process.
 */
export async function loginUser(email: string, password: string, expectedRole?: string): Promise<DocumentData> {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  try {
    // Firebase Auth login
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    // Fetch user details from Firestore
    const snapshot = await getDoc(doc(db, "users", userCred.user.uid));

    if (!snapshot.exists()) {
      await signOut(auth);
      throw new Error("User profile not found");
    }

    const userData = snapshot.data();

    // Validate role match
    if (userData.userType !== expectedRole) {
      await signOut(auth);
      throw new Error(
        `You are registered as a ${userData.userType === "ev" ? "EV Driver" : "Emergency Responder"}`
      );
    }

    return userData;

  } catch (err: any) {
    throw new Error(err.message);
  }
}

/**
 * Logs out current user.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err: any) {
    throw new Error("Logout failed: " + err.message);
  }
}