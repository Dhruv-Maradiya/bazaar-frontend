// ** React Imports
import { createContext, useEffect } from "react";

// ** Third Party Components
import toast from "react-hot-toast";

// ** Next Import
import { resetStore } from "@/store/settings/user";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser as setStoreUser } from "@/store/settings/user";
import { auth } from "@/lib/firebase/auth";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getUser: () => Promise.resolve(),
  initAuth: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const { user, loading, sessionId } = useSelector((state) => state.settings);

  // ** Hooks
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, sessionId]);

  const setUser = (user) => {
    dispatch(setStoreUser(user));
  };

  const initAuth = async () => {
    try {
      if (!router.isReady) {
        return;
      }

      await auth.authStateReady();

      if (auth.currentUser) {
        setUser(auth.currentUser);
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogin = async (body, returnUrl) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        body.email,
        body.password
      );

      toast.success("Logged in successfully.");

      router.push(returnUrl || "/");

      setUser(userCredential.user);

      return userCredential.user;
    } catch (err) {
      const errors = err.message || "Something went wrong. Please try again.";

      toast.error(errors);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    dispatch(resetStore());

    router.push("/auth/login");
  };

  const handleSendResetPasswordLink = async (params) => {
    try {
      await sendPasswordResetEmail(params.email);

      toast.success("Password reset link sent successfully.");
    } catch (err) {
      const errors = err?.message || "Something went wrong. Please try again.";

      toast.error(errors);
    }
  };

  const values = {
    user,
    loading,
    setUser,
    login: handleLogin,
    logout: handleLogout,
    sendResetPasswordLink: handleSendResetPasswordLink,
    initAuth: initAuth,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
