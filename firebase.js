import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW_ZlkJW0SahUipxjeH3_ipHRcWOIT3l8",
  authDomain: "medecro-b44ff.firebaseapp.com",
  projectId: "medecro-b44ff",
  storageBucket: "medecro-b44ff.appspot.com",
  messagingSenderId: "50161147046",
  appId: "1:50161147046:web:5c024b4a3958336fd76867"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Signup function - creates a new user with email and password
 * and stores additional user information in Firestore.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password for the account.
 */
const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {  // Changed to "users" for convention
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    toast.success("Account created successfully!");
  } catch (error) {
    console.error("Signup Error:", error);  // Log the error for debugging
    switch (error.code) {
      case 'auth/email-already-in-use':
        toast.error("This email is already in use.");
        break;
      case 'auth/invalid-email':
        toast.error("Invalid email format.");
        break;
      case 'auth/weak-password':
        toast.error("Password is too weak.");
        break;
      default:
        toast.error(`Signup failed: ${error.message}`);
    }
  }
};

/**
 * Login function - logs in an existing user with email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password for the account.
 */
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Logged in successfully!");
  } catch (error) {
    console.error("Login Error:", error);  // Log the error for debugging
    switch (error.code) {
      case 'auth/invalid-email':
        toast.error("Invalid email format.");
        break;
      case 'auth/user-disabled':
        toast.error("User account is disabled.");
        break;
      case 'auth/user-not-found':
        toast.error("User not found.");
        break;
      case 'auth/wrong-password':
        toast.error("Incorrect password.");
        break;
      default:
        toast.error(`Login failed: ${error.message}`);
    }
  }
};

/**
 * Logout function - logs out the current user.
 */
const logout = async () => {
  try {
    await signOut(auth);
    toast.info("Logged out successfully!");
  } catch (error) {
    console.error("Logout Error:", error);  // Log the error for debugging
    toast.error(`Logout failed: ${error.message}`);
  }
};

// Export the Firebase authentication and Firestore instances and functions
export { auth, db, login, signup, logout };
