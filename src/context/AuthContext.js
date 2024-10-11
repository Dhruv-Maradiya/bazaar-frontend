// ** React Imports
import { createContext, useEffect, useRef } from "react";

// ** Third Party Components
import toast from "react-hot-toast";

// ** Next Import
import { auth } from "@/lib/firebase/init";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { compose } from "@reduxjs/toolkit";
import { Typography } from "@mui/material";

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
  const initialLoad = useRef({
    oldNews: [],
    initial: true,
  }); // To track whether it's the first load

  const { auth: userAuth } = useSelector((state) => state.firebase);
  const news = useSelector((state) => state.firestore.ordered.dashboardNews);

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

    window.location.reload();
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

  useEffect(() => {
    if (isLoaded(news) && !isEmpty(news)) {
      if (!initialLoad.current.initial) {
        // Check if there are new news
        const newNews = news.filter(
          (item) =>
            !initialLoad.current.oldNews.find(
              (oldItem) => oldItem.id === item.id
            )
        );

        // If there are new news, show a toast
        if (newNews.length) {
          newNews.forEach((item) => {
            toast.success(
              <Typography variant="body1">{item.title}</Typography>,
              {
                position: "top-center",
                style: {
                  minWidth: "fit-content",
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  wordBreak: "break-word",
                },
              }
            );
          });
        }

        // Update old news
        initialLoad.current.oldNews = news;
      } else {
        // Mark initial load as complete
        initialLoad.current.initial = false;
        initialLoad.current.oldNews = news;
      }
    }
  }, [news]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

const AuthProviderComposed = compose(
  firestoreConnect(() => [
    {
      collection: "news",
      limit: 5,
      orderBy: ["releaseAt", "desc"],
      where: ["visible", "==", true],
      storeAs: "dashboardNews",
    },
  ])
)(AuthProvider);

const AuthConsumer = AuthContext.Consumer;

export { AuthConsumer, AuthContext, AuthProviderComposed as AuthProvider };

