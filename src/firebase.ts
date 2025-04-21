// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvuxac3XrKSI1qkfKZ1ACcFBZXGpcmeHc",
  authDomain: "affiliatehub-b70ee.firebaseapp.com",
  projectId: "affiliatehub-b70ee",
  storageBucket: "affiliatehub-b70ee.firebasestorage.app",
  messagingSenderId: "623439661135",
  appId: "1:623439661135:web:c2a04f14cceed528fc823a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your app
// All Firestore document IDs are strings
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
