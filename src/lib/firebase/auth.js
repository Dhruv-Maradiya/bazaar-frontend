import { app } from "./init";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(app);

const handleSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    return error;
  }
};

const handleSignOut = async () => {
  try {
    await auth.signOut();

    return true;
  } catch (error) {
    return error;
  }
};

const handleForgotPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    return error;
  }
};

export { auth, handleSignIn, handleSignOut, handleForgotPassword };
