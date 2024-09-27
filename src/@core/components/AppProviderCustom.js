import { useAuth } from "@/hooks/useAuth";
import NAVIGATION from "@/navigation/navigation";
import { AppProvider } from "@toolpad/core/nextjs";
import { useRouter } from "next/router";

const CustomAppProvider = ({ children, settings }) => {
  const router = useRouter();

  const { logout, user } = useAuth();

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
    >
      {children}
    </AppProvider>
  );
};

export default CustomAppProvider;
