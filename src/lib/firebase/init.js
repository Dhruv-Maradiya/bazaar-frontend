import { firebaseConfig } from "@/configs/firebase";
import { initializeApp, getApps } from "firebase/app";

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export { app };
