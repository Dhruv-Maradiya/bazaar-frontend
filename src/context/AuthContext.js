// ** React Imports
import { createContext } from "react";

// ** Third Party Components
import toast from "react-hot-toast";

// ** Next Import
import { auth } from "@/lib/firebase/init";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  sendResetPasswordLink: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  // ** States
  const { auth: userAuth } = useSelector((state) => state.firebase);

  // ** Vars
  const user = userAuth;
  const loading = !userAuth.isLoaded;

  // ** Hooks
  const router = useRouter();

  const handleLogin = async (body, returnUrl) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        body.email,
        body.password
      );

      toast.success("Logged in successfully.");

      router.push(returnUrl || "/");

      return userCredential.user;
    } catch (err) {
      const errors = err.message || "Something went wrong. Please try again.";

      toast.error(errors);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();

    router.push("/auth/login");
  };

  const handleSendResetPasswordLink = async (params) => {
    try {
      await auth.sendPasswordResetEmail(params.email);

      toast.success("Password reset link sent successfully.");
    } catch (err) {
      const errors = err?.message || "Something went wrong. Please try again.";

      toast.error(errors);
    }
  };

  const values = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    sendResetPasswordLink: handleSendResetPasswordLink,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };

