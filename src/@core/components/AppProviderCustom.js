import customTheme from "@/configs/theme/theme";
import { useAuth } from "@/hooks/useAuth";
import NAVIGATION from "@/navigation/navigation";
import { compose } from "@reduxjs/toolkit";
import { AppProvider } from "@toolpad/core/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

const CustomAppProvider = ({ children, settings }) => {
  const router = useRouter();

  const { logout, user } = useAuth();

  const firestoreUser = useSelector(
    (state) => state.firestore.data?.firestoreUser,
  );

  useEffect(() => {
    if (firestoreUser?.disabled && !user.isEmpty && user.isLoaded) {
      logout();
    }
  }, [firestoreUser?.disabled, logout, user]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        title: settings.appName,
        // eslint-disable-next-line @next/next/no-img-element
        logo: <img src="/images/logo.png" alt="Toolpad Logo" />,
      }}
      authentication={{
        signIn: () => {
          if (router.pathname !== "/auth/login") router.push("/auth/login");
        },
        signOut: logout,
      }}
      session={{
        user: {
          email: user?.email,
          id: user?.uid,
          name: user?.displayName,
          image: user?.photoURL,
        },
      }}
      theme={customTheme}
    >
      {children}
    </AppProvider>
  );
};

export default compose(
  firestoreConnect((props) => {
    if (!props.user?.uid) return [];
    return [
      {
        collection: "users",
        doc: props.user.uid,
        storeAs: "firestoreUser",
      },
    ];
  }),
)(CustomAppProvider);
